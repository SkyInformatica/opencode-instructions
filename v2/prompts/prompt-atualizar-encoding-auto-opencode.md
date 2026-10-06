Atualize o plugin encoding-auto (OpenCode V2) já instalado nesta máquina Windows para a versão mais recente do repositório Sky. Preserve tudo o que já existe — não remova nem altere outras configurações.

Contexto: o plugin está em `%USERPROFILE%\.config\opencode\plugins\encoding-auto\index.ts` e é distribuído em:
`https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/v2/plugins/encoding-auto/index.ts`

Passos:

1. Pré-requisitos:
   - OpenCode **V2** (`opencode --version` ou `opencode2 --version` = 2.x). Se for V1, pare e avise.
   - `%USERPROFILE%\.config\opencode\plugins\encoding-auto\index.ts` existe. Se não existir, use o prompt de instalação, não este.

2. Backup do arquivo atual:
   - Copie `index.ts` para `index.ts.bak-AAAAMMDD` na mesma pasta. Se já existir backup do mesmo dia, mantenha o mais antigo.

3. Substitua pelo arquivo novo:
   ```
   curl -L -o "%USERPROFILE%\.config\opencode\plugins\encoding-auto\index.ts" https://raw.githubusercontent.com/SkyInformatica/opencode-instructions/main/v2/plugins/encoding-auto/index.ts
   ```
   (Se o repo estiver clonado: `git pull` e copie `v2/plugins/encoding-auto/index.ts` para o destino.)

4. Confira as dependências em `%USERPROFILE%\.config\opencode\package.json`:
   - `"dependencies"` deve conter `@opencode/plugin`, `chardet` e `iconv-lite`.
   - Se faltar alguma, adicione preservando o resto do arquivo e rode:
     ```
     cd %USERPROFILE%\.config\opencode && npm install
     ```

5. Valide o arquivo baixado:
   - contém `Plugin.define({ id: "encoding-auto" ... })`;
   - contém a normalização do nome de ferramenta e o registro de erros (`encoding-auto.log`).

6. Teste real: leia um arquivo Delphi (`.pas`) com acentos e confirme que aparecem corretos; edite uma linha ASCII, salve e confirme que o arquivo continua sem caracteres corrompidos.

7. Peça para reiniciar o OpenCode — o plugin só recarrega no restart.

8. Me informe: caminho do backup, arquivo novo instalado, dependências conferidas e que é preciso reiniciar.
