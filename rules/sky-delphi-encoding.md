# Edição de arquivos Delphi — encoding e irreversibilidade

## ⚠️ ALERTA CRÍTICO — encoding

### Editar `.pas` / `.dpr` / `.dfm` só por script Python

- Usar o encoding original do arquivo (padrão: **cp1252**) e **CRLF**.
- **PROIBIDO** usar a ferramenta genérica de edição/escrita nesses arquivos — ela grava UTF-8 e quebra a acentuação.

```python
# ponytail: existe — a ferramenta genérica de escrita grava UTF-8 e destrói acentuação
data = open(path, "rb").read()
text = data.decode("cp1252")
# ... alterar text ...
crlf = text.replace("\r\n", "\n").replace("\n", "\r\n")
open(path, "wb").write(crlf.encode("cp1252"))
```

### Verificar os bytes após cada edição

Checar o arquivo inteiro:

- `EF BF BD` (acento destruído) ausente
- `C3` (byte UTF-8) ausente
- `\r\n` presente
- decodifica em cp1252 sem erro

## Antes de editar ou sobrescrever arquivo existente

1. Rodar `svn status` no arquivo e checar o tamanho.
2. Mostrar o que será alterado.
3. **Aguardar aprovação do usuário.**

Em caso de dúvida: **parar e perguntar**. Nunca "consertar" por conta própria.
