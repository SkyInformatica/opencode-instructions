using System;
using System.Drawing;
using System.IO;
using FastReport;
using FastReport.Export.Image;

// Mede, em 600 dpi, o deslocamento interno do texto em relacao a borda do
// TextObject, por tamanho de fonte, com e sem negrito, alinhado a esquerda
// (Padding.Left = 0) e a direita (Padding.Right = 0).
//
//   offset_esquerda = Padding.Left  + gL(tamanho, negrito)
//   offset_direita  = Padding.Right + gR(tamanho, negrito)
//
// A 600 dpi a granularidade cai de 1 px para ~0,16 px (na escala de 96 dpi),
// o que permite enxergar diferencas sub-pixel entre tamanhos e pesos.
class Program
{
    record Cfg(float tamanho, bool negrito, string alinhamento, int padL, int padR, string texto);

    const int Dpi = 600;
    const float Left = 60f, Largura = 200f, Passo = 30f;

    static void Main(string[] args)
    {
        if (args.Length > 0) { ChecarCarga(args[0]); return; }

        float[] tamanhos = { 7f, 7.5f, 8f, 8.5f, 9f, 10.5f, 14f };

        var cfgs = new System.Collections.Generic.List<Cfg>();
        foreach (var t in tamanhos)
            foreach (var b in new[] { false, true })
            {
                cfgs.Add(new Cfg(t, b, "Left", 0, 2, "HHHHH"));
                cfgs.Add(new Cfg(t, b, "Right", 2, 0, "HHHHH"));
            }

        var report = new Report();
        var page = new ReportPage();
        report.Pages.Add(page);
        var band = new ReportTitleBand { Height = Passo * cfgs.Count + 20f };
        page.ReportTitle = band;

        for (int i = 0; i < cfgs.Count; i++)
        {
            var c = cfgs[i];
            var to = new TextObject
            {
                Left = Left,
                Top = Passo * i + 8f,
                Width = Largura,
                Height = 24f,
                Text = c.texto,
                HorzAlign = c.alinhamento == "Left" ? HorzAlign.Left : HorzAlign.Right,
                VertAlign = VertAlign.Center,
            };

            var padProp = typeof(TextObject).GetProperty("Padding");
            var padVal = Activator.CreateInstance(padProp.PropertyType, new object[] { c.padL, 0, c.padR, 0 });
            padProp.SetValue(to, padVal);

            to.Font = new Font("Open Sans", c.tamanho, c.negrito ? FontStyle.Bold : FontStyle.Regular);
            band.Objects.Add(to);
        }

        report.Prepare();
        var img = new ImageExport { ImageFormat = ImageExportFormat.Png, ResolutionX = Dpi, ResolutionY = Dpi };
        var outPath = Path.Combine(AppContext.BaseDirectory, "medicao.png");
        report.Export(img, outPath);

        using var bmp = new Bitmap(outPath);
        double escala = Dpi / 96.0;
        double margemPx = page.LeftMargin * Dpi / 25.4;
        double leftImg = Left * escala + margemPx;
        double rightImg = (Left + Largura) * escala + margemPx;

        Console.WriteLine($"imagem {bmp.Width}x{bmp.Height} px @ {Dpi} dpi | escala={escala} | LeftMargin={page.LeftMargin}mm | margem={margemPx:0.00}px | fator={bmp.Width / (page.PaperWidth * Dpi / 25.4):0.000}");
        Console.WriteLine($"borda esquerda do objeto -> x={leftImg:0.00} | borda direita -> x={rightImg:0.00}");
        Console.WriteLine();
        Console.WriteLine("tam   peso   alinh | offset (px a 96 dpi)");
        Console.WriteLine("--------------------------------------------");

        var gl = new System.Collections.Generic.Dictionary<string, double>();
        var gr = new System.Collections.Generic.Dictionary<string, double>();

        foreach (var c in cfgs)
        {
            int i = cfgs.IndexOf(c);
            double centroY = (Passo * i + 8f + 12f) * escala + margemPx;
            int meioY = (int)Math.Round(centroY);
            double offset;

            if (c.alinhamento == "Left")
            {
                int inicio = -1;
                for (int x = (int)leftImg - 2; x < bmp.Width && inicio < 0; x++)
                    for (int dy = -20; dy <= 20; dy++)
                    {
                        int y = meioY + dy;
                        if (y >= 0 && y < bmp.Height && IsDark(bmp.GetPixel(x, y))) { inicio = x; break; }
                    }
                offset = inicio < 0 ? double.NaN : (inicio - leftImg) / escala;
                gl[$"{c.tamanho}|{c.negrito}"] = offset;
            }
            else
            {
                int fim = -1;
                for (int x = (int)rightImg + 2; x >= 0 && fim < 0; x--)
                    for (int dy = -20; dy <= 20; dy++)
                    {
                        int y = meioY + dy;
                        if (y >= 0 && y < bmp.Height && IsDark(bmp.GetPixel(x, y))) { fim = x; break; }
                    }
                offset = fim < 0 ? double.NaN : (rightImg - fim) / escala;
                gr[$"{c.tamanho}|{c.negrito}"] = offset;
            }

            Console.WriteLine(string.Format("{0,5} {1,-6} {2,6} | y={3,6} {4,8:0.00}", c.tamanho, c.negrito ? "bold" : "reg", c.alinhamento, meioY, offset));
        }

        Console.WriteLine();
        Console.WriteLine("== gL / gR por tamanho e peso (px a 96 dpi) ==");
        Console.WriteLine("tam   peso      gL     gR");
        foreach (var t in tamanhos)
            foreach (var b in new[] { false, true })
                Console.WriteLine(string.Format("{0,5} {1,-6} {2,7:0.00} {3,7:0.00}", t, b ? "bold" : "reg", gl[$"{t}|{b}"], gr[$"{t}|{b}"]));

        // Alvo de cada grupo = maior gL (ou gR) do grupo. Aqui, o maior gL de todos.
        double maxGl = 0, maxGr = 0;
        foreach (var v in gl.Values) if (v > maxGl) maxGl = v;
        foreach (var v in gr.Values) if (v > maxGr) maxGr = v;

        Console.WriteLine();
        Console.WriteLine($"== Padding.Left necessario para todos comecarem no mesmo x (alvo gL={maxGl:0.00}) ==");
        foreach (var t in tamanhos)
            foreach (var b in new[] { false, true })
                Console.WriteLine(string.Format("{0,5} {1,-6} -> padL = {2:0.00}", t, b ? "bold" : "reg", maxGl - gl[$"{t}|{b}"]));

        Console.WriteLine();
        Console.WriteLine($"== Padding.Right necessario para todos terminarem no mesmo x (alvo gR={maxGr:0.00}) ==");
        foreach (var t in tamanhos)
            foreach (var b in new[] { false, true })
                Console.WriteLine(string.Format("{0,5} {1,-6} -> padR = {2:0.00}", t, b ? "bold" : "reg", maxGr - gr[$"{t}|{b}"]));
    }

    static bool IsDark(Color p) => p.R < 200 && p.G < 200 && p.B < 200;

    // Confirma que o FastReport carrega o .frx e le de volta o Padding fracionario.
    static void ChecarCarga(string caminho)
    {
        var report = new Report();
        report.Load(caminho);
        Console.WriteLine($"Load OK: {Path.GetFileName(caminho)}");

        var padProp = typeof(TextObjectBase).GetProperty("Padding");
        var tpPad = padProp.PropertyType;
        Console.WriteLine($"Tipo de Padding: {tpPad.FullName}");
        foreach (var p in tpPad.GetProperties()) Console.WriteLine($"  prop  {p.Name} : {p.PropertyType.Name}");
        Console.WriteLine();

        Console.WriteLine("Propriedades float/duplo de TextObjectBase (candidatas a deslocamento continuo):");
        foreach (var p in typeof(TextObjectBase).GetProperties())
        {
            var t = p.PropertyType;
            if (t == typeof(float) || t == typeof(double) || t == typeof(decimal))
                Console.WriteLine($"  {p.Name} : {t.Name}");
        }
        Console.WriteLine();
        Console.WriteLine("Propriedades float/duplo de TextObject:");
        foreach (var p in typeof(TextObject).GetProperties())
        {
            var t = p.PropertyType;
            if (t == typeof(float) || t == typeof(double) || t == typeof(decimal))
                Console.WriteLine($"  {p.Name} : {t.Name}");
        }
        Console.WriteLine();

        int n = 0;
        foreach (var o in report.AllObjects)
        {
            if (!(o is TextObjectBase t)) continue;
            n++;
            object pad = padProp.GetValue(t);
            var tp = pad.GetType();
            object Ler(string membro)
            {
                var p = tp.GetProperty(membro);
                if (p != null) return p.GetValue(pad);
                var f = tp.GetField(membro);
                return f != null ? f.GetValue(pad) : null;
            }
            Console.WriteLine($"  {t.Name,-30} padL={Ler("Left")} padR={Ler("Right")} texto={t.Text?.Substring(0, Math.Min(18, t.Text?.Length ?? 0))}");
        }
        Console.WriteLine($"TextObjects lidos: {n}");
    }
}
