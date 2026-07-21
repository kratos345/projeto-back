ER Diagram files created:

- `docs/er-diagram.mmd` — Mermaid source file
- `docs/er-diagram.md` — Markdown with embedded Mermaid block

How to generate an image (SVG/PNG)

1) Install mermaid-cli (requires Node.js)

```bash
npm install -g @mermaid-js/mermaid-cli
# or using npx without global install
npx @mermaid-js/mermaid-cli -v
```

2) Generate SVG or PNG from the `.mmd` source:

```bash
# SVG
npx @mermaid-js/mermaid-cli -i docs/er-diagram.mmd -o docs/er-diagram.svg

# PNG
npx @mermaid-js/mermaid-cli -i docs/er-diagram.mmd -o docs/er-diagram.png
```

3) In VSCode, you can also install the "Markdown Preview Mermaid Support" or "Mermaid Preview" extensions and open `docs/er-diagram.md` to preview and export as image.

Notes
- If you need small edits (renomear colunas, traduzir nomes), atualize `docs/er-diagram.mmd` e regenere a imagem.
