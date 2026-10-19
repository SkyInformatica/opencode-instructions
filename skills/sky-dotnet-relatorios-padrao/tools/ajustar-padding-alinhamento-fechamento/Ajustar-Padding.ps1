#requires -Version 5.1
<#
    Alinha a borda do TEXTO (nao a borda do objeto) dos TextObject dos templates
    FastReport de fechamento de conta, e faz as divisórias comecarem e terminarem
    nessas bordas.

    Modelo (medido em 600 dpi pelo harness medir-deslocamento-texto-fastreport):

        borda_esquerda = Left  + Padding.Left  + gL(tamanho, negrito)
        borda_direita  = Left + Width - Padding.Right - gR(tamanho, negrito)

    gL/gR sao o deslocamento natural do glifo (medido com Padding zerado). Crescem
    com o tamanho da fonte; o negrito desloca ~0,2 px para a esquerda.

    LIMITACAO: FastReport.TextObjectBase.Padding e System.Windows.Forms.Padding,
    cujos membros sao Int32 - nao aceita fracao (valor fracionario no XML e
    descartado e o Padding volta ao default). Como a diferenca entre tamanhos
    vizinhos e menor que 1 px (7 pt negrito x 8 pt regular = 0,48 px), o Padding
    sozinho nunca alinha.

    Solucao: o Padding carrega a parte INTEIRA da compensacao e o Left (ou o
    Width, no alinhamento a direita) carrega o resto sub-pixel. O objeto de maior
    deslocamento do lado e a referencia: fica com Padding 0 e com a geometria da
    coluna intacta.

        esquerda: padL = floor(alvoGl - gL)   Left  += (alvoGl - gL) - padL
        direita : padR = floor(alvoGr - gR)   Width -= (alvoGr - gR) - padR

    Alvos: alvoGl = 4.92 (Titulo, 14 pt negrito, o maior do lado esquerdo)
           alvoGr = 2.92 (8 pt, o maior gR entre os alinhados a direita)

    Resultado: toda borda esquerda de texto cai em alvoGl e toda borda direita em
    737.01 - alvoGr. As divisórias cobrem exatamente esse intervalo.

    Objetos centralizados (RodapeUsuario) nao sao alterados.
#>
param([switch]$Aplicar)

$base = "C:\Sky.Azure\core\test\Aceitacao\Dominio\Financeiro\SkyInfo.Core.Dominio.Financeiro.MovimentaçãoFinanceira.Consulta.Ravendb.Aceitacao.Tests\SuiteDeTeste\09-ImpressãoFechamento\02-CriarModelosFastReport"
$arquivos = @(
    "RelatorioDeFechamentoDeContaSintetico.frx",
    "RelatorioDeFechamentoDeContaAnalitico.frx"
)

$invar = [System.Globalization.CultureInfo]::InvariantCulture

# tabela medida a 600 dpi: chave "tamanho|peso" -> gl (esquerda) e gr (direita)
$medido = @{
    '7|reg'    = @{ gl = 2.52; gr = 2.76 }
    '7|bold'   = @{ gl = 2.36; gr = 2.44 }
    '7.5|reg'  = @{ gl = 2.68; gr = 2.76 }
    '7.5|bold' = @{ gl = 2.68; gr = 2.60 }
    '8|reg'    = @{ gl = 2.84; gr = 2.92 }
    '8|bold'   = @{ gl = 2.68; gr = 2.92 }
    '8.5|reg'  = @{ gl = 3.00; gr = 3.08 }
    '8.5|bold' = @{ gl = 2.84; gr = 3.08 }
    '9|reg'    = @{ gl = 3.32; gr = 3.56 }
    '9|bold'   = @{ gl = 3.16; gr = 3.40 }
    '10.5|reg' = @{ gl = 3.80; gr = 4.04 }
    '10.5|bold'= @{ gl = 3.64; gr = 4.04 }
    '14|reg'   = @{ gl = 5.08; gr = 5.48 }
    '14|bold'  = @{ gl = 4.92; gr = 5.32 }
}

$alvoGl = 4.92   # gL do maior objeto alinhado a esquerda (Titulo, 14 pt negrito)
$alvoGr = 2.92   # maior gR entre os objetos alinhados a direita (8 pt)

$larguraBanda = 737.01
$bordaEsquerda = $alvoGl
$bordaDireita  = $larguraBanda - $alvoGr
$larguraLinha  = [Math]::Round($bordaDireita - $bordaEsquerda, 2)

$bordaEsquerdaTxt = $bordaEsquerda.ToString('0.00', $invar)
$bordaDireitaTxt  = $bordaDireita.ToString('0.00', $invar)
$larguraLinhaTxt  = $larguraLinha.ToString('0.00', $invar)

$utf8Bom = New-Object System.Text.UTF8Encoding($true)

function Get-Peso($attrs) { if ($attrs -match 'style=Bold') { 'bold' } else { 'reg' } }

# numero -> texto sem zeros a direita inuteis ("2" e nao "2.00")
function Fmt($v) { ([Math]::Round($v, 2)).ToString('0.##', $invar) }

foreach ($nome in $arquivos) {
    $caminho = Join-Path $base $nome
    $conteudo = [System.IO.File]::ReadAllText($caminho, [System.Text.Encoding]::UTF8)

    Write-Output ""
    Write-Output "################################################################"
    Write-Output "# $nome"
    Write-Output "################################################################"
    Write-Output ""
    Write-Output ("{0,-30} {1,-5} {2,-5} {3,-6} {4,-24} {5,-9} {6,-24} {7,-9} {8}" -f 'OBJETO','PT','PESO','ALINH','PADDING (antes->depois)','','LEFT/WIDTH (antes->depois)','','BORDA')
    Write-Output ("{0,-30} {1,-5} {2,-5} {3,-6} {4,-24} {5,-9} {6,-24} {7,-9} {8}" -f ('-'*30),('-'*5),('-'*5),('-'*6),('-'*24),('-'*9),('-'*24),('-'*9),('-'*30))

    $plano = @{}
    $bordasEsq = @{}
    $bordasDir = @{}

    foreach ($m in [regex]::Matches($conteudo, '<TextObject\b([^>]*?)/>')) {
        $a = $m.Groups[1].Value
        $nm = if ($a -match 'Name="([^"]+)"') { $Matches[1] } else { '' }
        $ha = if ($a -match 'HorzAlign="([^"]+)"') { $Matches[1] } else { 'Left' }
        $tam = if ($a -match 'Font="[^"]*?([0-9.]+)pt') { $Matches[1] } else { '' }
        $peso = Get-Peso $a
        $left0 = if ($a -match 'Left="([0-9.\-]+)"') { [double]$Matches[1] } else { 0 }
        $width0 = if ($a -match 'Width="([0-9.]+)"') { [double]$Matches[1] } else { 0 }
        $antes = if ($a -match 'Padding="([^"]+)"') { $Matches[1] } else { $null }

        $novoPad = $antes; $novoLeft = $null; $novoWidth = $null; $borda = ''
        $chave = "$tam|$peso"

        if ($ha -eq 'Center') {
            # nao alterado
        }
        elseif (-not $medido.ContainsKey($chave)) {
            Write-Output ("  !! sem medicao para $chave ($nm)")
        }
        elseif ($ha -eq 'Right') {
            $comp = $alvoGr - $medido[$chave].gr
            $padR = [Math]::Floor($comp + 1e-9)
            $resto = [Math]::Round($comp - $padR, 4)
            $novoPad = "0, 0, $(Fmt $padR), 0"
            if ($resto -ne 0) { $novoWidth = [Math]::Round($width0 - $resto, 2) }
            $borda = $left0 + ($novoWidth ?? $width0) - $padR - $medido[$chave].gr
            $bordasDir[[Math]::Round($left0 + ($novoWidth ?? $width0), 2)] = $borda
        }
        else {
            $comp = $alvoGl - $medido[$chave].gl
            $padL = [Math]::Floor($comp + 1e-9)
            $resto = [Math]::Round($comp - $padL, 4)
            $novoPad = "$(Fmt $padL), 0, 2, 0"
            if ($resto -ne 0) { $novoLeft = [Math]::Round($left0 + $resto, 2) }
            $borda = ($novoLeft ?? $left0) + $padL + $medido[$chave].gl
            $bordasEsq[[Math]::Round(($novoLeft ?? $left0), 2)] = $borda
        }

        $plano[$nm] = @{ pad = $novoPad; left = $novoLeft; width = $novoWidth }

        $padAntes = if ($antes) { $antes } else { '(default)' }
        $padDepois = if ($novoPad) { $novoPad } else { '(default)' }
        $geoAntes = "$(Fmt $left0) / $(Fmt $width0)"
        $geoDepois = "$(Fmt ($novoLeft ?? $left0)) / $(Fmt ($novoWidth ?? $width0))"
        $marca = if ("$padAntes|$geoAntes" -eq "$padDepois|$geoDepois") { ' ' } else { '*' }
        Write-Output ("{0} {1,-29} {2,-5} {3,-5} {4,-6} {5,-11}->{6,-11} {7,-11}->{8,-11} {9}" -f $marca, $nm, $tam, $peso, $ha, $padAntes, $padDepois, $geoAntes, $geoDepois, $(if ($borda -ne '') { (Fmt $borda) } else { '-' }))
    }

    Write-Output ""
    Write-Output ("{0,-30} {1,-12} {2,-14} {3}" -f 'DIVISORIA', 'ANTES L/W', 'DEPOIS L/W', 'FIM')
    Write-Output ("{0,-30} {1,-12} {2,-14} {3}" -f ('-' * 30), ('-' * 12), ('-' * 14), ('-' * 30))
    foreach ($m in [regex]::Matches($conteudo, '<LineObject\b([^>]*?)/>')) {
        $a = $m.Groups[1].Value
        $nm = if ($a -match 'Name="([^"]+)"') { $Matches[1] } else { '' }
        $l = if ($a -match 'Left="([0-9.]+)"') { [double]$Matches[1] } else { 0 }
        $w = if ($a -match 'Width="([0-9.]+)"') { [double]$Matches[1] } else { 0 }
        Write-Output ("{0,-30} {1,-12} {2,-14} {3}" -f $nm, "$l / $w", "$bordaEsquerdaTxt / $larguraLinhaTxt", "$bordaEsquerdaTxt .. $bordaDireitaTxt")
    }

    if (-not $Aplicar) { continue }

    $novoConteudo = [regex]::Replace($conteudo, '<TextObject\b([^>]*?)/>', {
        param($m)
        $a = $m.Groups[1].Value
        $nm = if ($a -match 'Name="([^"]+)"') { $Matches[1] } else { '' }
        if (-not $plano.ContainsKey($nm)) { return $m.Value }
        $p = $plano[$nm]

        # Padding: mantem a posicao do atributo (depois de Text quando novo)
        if ($null -eq $p.pad) {
            $a = $a -replace '\s*Padding="[^"]*"', ''
        }
        elseif ($a -match 'Padding="[^"]*"') {
            $a = $a -replace 'Padding="[^"]*"', ('Padding="' + $p.pad + '"')
        }
        elseif ($a -match 'Text="[^"]*"') {
            $a = $a -replace '(Text="[^"]*")', ('$1 Padding="' + $p.pad + '"')
        }
        else { $a = $a + ' Padding="' + $p.pad + '"' }

        # Left
        if ($null -ne $p.left) {
            $v = (Fmt $p.left)
            if ($a -match '(?<![\w.])Left="[^"]*"') { $a = $a -replace '(?<![\w.])Left="[^"]*"', ('Left="' + $v + '"') }
            else { $a = $a -replace '(Name="[^"]*")', ('$1 Left="' + $v + '"') }
        }

        # Width
        if ($null -ne $p.width) {
            $a = $a -replace '(?<![\w.])Width="[^"]*"', ('Width="' + (Fmt $p.width) + '"')
        }

        return '<TextObject' + $a + '/>'
    })

    $novoConteudo = [regex]::Replace($novoConteudo, '<LineObject\b([^>]*?)/>', {
        param($m)
        $a = $m.Groups[1].Value
        $a = $a -replace '\s*Left="[^"]*"', ''
        $a = $a -replace '(Name="[^"]*")', ('$1 Left="' + $bordaEsquerdaTxt + '"')
        # (?<![\w.]) evita casar Border.Width, Text.Width etc.
        $a = $a -replace '(?<![\w.])Width="[^"]*"', ('Width="' + $larguraLinhaTxt + '"')
        return '<LineObject' + $a + '/>'
    })

    [System.IO.File]::WriteAllText($caminho, $novoConteudo, $utf8Bom)
    Write-Output ""
    Write-Output ">> ARQUIVO GRAVADO: $caminho"
}

if (-not $Aplicar) {
    Write-Output ""
    Write-Output "== DRY-RUN (nada foi gravado). Rode com -Aplicar para gravar. =="
}
