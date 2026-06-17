// gerar-pdf.js
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function gerarPaginaInfinita(browser, url, nomeArquivo) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

    console.log(`Acessando: ${url} ...`);
    
    try {
        const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
        
        // Verifica se a página retornou um erro (como 404 ou 500)
        if (!response || response.status() >= 400) {
            console.error(`❌ Erro [Status ${response ? response.status() : 'N/O'}] ao acessar ${url}. Pulando...`);
            await page.close();
            return;
        }

        console.log('Aguardando a renderização dos scripts e do mapa...');
        await delay(3000); 

        const totalHeight = await page.evaluate(() => {
            const body = document.body;
            const html = document.documentElement;
            return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        });

        await page.emulateMediaType('screen');

        // 🚀 O Puppeteer agora salva o arquivo diretamente na pasta configurada no caminho absoluto
        await page.pdf({
            path: nomeArquivo,
            width: '1440px',
            height: `${totalHeight + 50}px`, 
            printBackground: true,            
            margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
        });

        console.log(`✅ PDF salvo com sucesso em: ${nomeArquivo}\n`);
    } catch (err) {
        console.error(`❌ Falha ao processar a URL ${url}: ${err.message}`);
    } finally {
        await page.close();
    }
}

(async () => {
    // 🚀 1. Define e garante a existência da pasta "preview" na raiz do projeto
    const outputDir = path.resolve(process.cwd(), 'preview');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`📁 Pasta criada: ${outputDir}`);
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--enable-webgl', '--use-gl=swiftshader']
    });

    // Endereço base do servidor local do Astro
    const BASE_URL = 'http://localhost:4321'; 

    try {
        // 🚀 2. Acopla o caminho da pasta de saída ao nome dos arquivos fixos
        await gerarPaginaInfinita(browser, `${BASE_URL}/`, path.join(outputDir, 'review-1-homepage.pdf'));
        await gerarPaginaInfinita(browser, `${BASE_URL}/services`, path.join(outputDir, 'review-2-services.pdf'));

        // 3. Lê o seu arquivo JSON real para descobrir as rotas dinâmicas automáticas
        const jsonPath = path.resolve(process.cwd(), 'src/data/services.json');
        
        if (fs.existsSync(jsonPath)) {
            const fileContent = fs.readFileSync(jsonPath, 'utf-8');
            const listaServicos = JSON.parse(fileContent);

            console.log(`\nLocalizado o arquivo JSON. Gerando páginas dinâmicas para ${listaServicos.length} serviços...`);

            for (const servico of listaServicos) {
                // 🚀 4. Acopla o caminho da pasta de saída às rotas dinâmicas capturadas
                const caminhoCompleto = path.join(outputDir, `review-3-servico-${servico.id}.pdf`);
                await gerarPaginaInfinita(browser, `${BASE_URL}/services/${servico.id}`, caminhoCompleto);
            }
        } else {
            console.warn('\n⚠️ Arquivo src/data/services.json não encontrado. Pulando internas...');
        }

    } catch (error) {
        console.error('Ocorreu um erro geral durante a execução:', error);
    } finally {
        await browser.close();
        console.log('Processo finalizado!');
    }
})();