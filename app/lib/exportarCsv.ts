export function exportarCsv(nomeArquivo: string, cabecalho: string[], linhas: Array<Array<string | number>>) {
    const escapar = (valor: string | number) => `"${String(valor).replaceAll('"', '""')}"`
    const conteudo = [cabecalho, ...linhas].map((linha) => linha.map(escapar).join(";")).join("\r\n")
    const arquivo = new Blob([`\uFEFF${conteudo}`], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(arquivo)
    const link = document.createElement("a")

    link.href = url
    link.download = nomeArquivo
    link.click()
    URL.revokeObjectURL(url)
}
