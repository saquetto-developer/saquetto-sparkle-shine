import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportOptions {
  filename: string;
  title: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter';
}

/**
 * Exporta um elemento HTML para PDF com design profissional
 */
export async function exportToPDF(
  elementId: string,
  options: PDFExportOptions
): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Criar loading overlay
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'pdf-loading-overlay';
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: white;
    font-size: 18px;
    font-family: sans-serif;
  `;
  loadingDiv.innerHTML = `
    <div style="text-align: center;">
      <div style="margin-bottom: 16px;">
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#3b82f6" stroke-width="4" stroke-dasharray="31.4 31.4" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <div>Gerando PDF...</div>
      <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">Por favor, aguarde</div>
    </div>
  `;
  document.body.appendChild(loadingDiv);

  try {
    // Capturar o elemento como canvas com qualidade otimizada
    const canvas = await html2canvas(element, {
      scale: 1.5, // Qualidade balanceada (reduzido de 2 para 1.5)
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      ignoreElements: (el) => {
        // Ignorar elementos sticky/fixed que não devem aparecer no PDF
        const style = window.getComputedStyle(el);
        return style.position === 'sticky' || style.position === 'fixed';
      },
    });

    // Configurações do PDF
    const orientation = options.orientation || 'landscape';
    const pageFormat = options.pageSize || 'a4';

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageFormat,
    });

    // Dimensões da página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Margens
    const margin = 10;
    const contentWidth = pageWidth - (2 * margin);
    const contentHeight = pageHeight - (2 * margin) - 30; // Espaço para header e footer

    // Adicionar header
    addHeader(pdf, options.title, pageWidth, margin);

    // Calcular dimensões da imagem
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = margin + 20; // Após o header

    // Converter canvas para JPEG com compressão otimizada
    const imgData = canvas.toDataURL('image/jpeg', 0.85);

    // Se a imagem couber em uma página
    if (imgHeight <= contentHeight) {
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      addFooter(pdf, pageWidth, pageHeight, margin, 1, 1);
    } else {
      // Dividir em múltiplas páginas
      let heightLeft = imgHeight;
      let pageNumber = 1;
      const totalPages = Math.ceil(imgHeight / contentHeight);

      while (heightLeft > 0) {
        if (pageNumber > 1) {
          pdf.addPage();
          addHeader(pdf, options.title, pageWidth, margin);
          position = margin + 20;
        }

        const sourceY = (pageNumber - 1) * contentHeight * (canvas.height / imgHeight);
        const sourceHeight = Math.min(contentHeight * (canvas.height / imgHeight), canvas.height - sourceY);

        // Criar canvas temporário para esta página
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          tempCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );

          const pageImgData = tempCanvas.toDataURL('image/jpeg', 0.85);
          const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;

          pdf.addImage(pageImgData, 'JPEG', margin, position, imgWidth, pageImgHeight);
        }

        addFooter(pdf, pageWidth, pageHeight, margin, pageNumber, totalPages);

        heightLeft -= contentHeight;
        pageNumber++;
      }
    }

    // Salvar PDF
    pdf.save(`${options.filename}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // Remover loading overlay
    document.body.removeChild(loadingDiv);
  }
}

/**
 * Adiciona header profissional ao PDF
 */
function addHeader(pdf: jsPDF, title: string, pageWidth: number, margin: number): void {
  // Linha superior
  pdf.setDrawColor(59, 130, 246); // Blue-500
  pdf.setLineWidth(0.5);
  pdf.line(margin, margin + 5, pageWidth - margin, margin + 5);

  // Título
  pdf.setFontSize(16);
  pdf.setTextColor(30, 41, 59); // Slate-800
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, margin, margin + 12);

  // Data de geração
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139); // Slate-500
  pdf.setFont('helvetica', 'normal');
  const date = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  pdf.text(`Gerado em: ${date}`, pageWidth - margin - 60, margin + 12);

  // Linha inferior do header
  pdf.setDrawColor(226, 232, 240); // Slate-200
  pdf.setLineWidth(0.3);
  pdf.line(margin, margin + 16, pageWidth - margin, margin + 16);
}

/**
 * Adiciona footer profissional ao PDF
 */
function addFooter(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  currentPage: number,
  totalPages: number
): void {
  const footerY = pageHeight - margin - 5;

  // Linha superior do footer
  pdf.setDrawColor(226, 232, 240); // Slate-200
  pdf.setLineWidth(0.3);
  pdf.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  // Texto do footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139); // Slate-500
  pdf.setFont('helvetica', 'normal');

  // Esquerda: "Gerado por Saquetto - Auditoria Fiscal"
  pdf.text('Saquetto - Auditoria Fiscal', margin, footerY);

  // Centro: Site/Info
  const centerText = 'auditorfiscal.saquetto.com.br';
  const centerTextWidth = pdf.getTextWidth(centerText);
  pdf.text(centerText, (pageWidth - centerTextWidth) / 2, footerY);

  // Direita: Paginação
  const pageText = `Página ${currentPage} de ${totalPages}`;
  const pageTextWidth = pdf.getTextWidth(pageText);
  pdf.text(pageText, pageWidth - margin - pageTextWidth, footerY);
}

/**
 * Formata nome de arquivo com data
 */
export function formatFilename(baseName: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${baseName}_${year}-${month}-${day}`;
}
