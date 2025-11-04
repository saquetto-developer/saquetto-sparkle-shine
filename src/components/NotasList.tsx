import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { getPublicInvoiceUrl } from '@/lib/invoiceStorage';
import { filterByTaxRegime, getTaxRegimeShortLabel, type TaxRegime } from '@/lib/taxRegimeUtils';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText,
  Calendar,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Receipt
} from 'lucide-react';

interface Nota {
  id: number;
  numero_nfe: string;
  data_emissao: string;
  situacao: string;
  destinatario_razao_social: string;
  emitente_razao_social: string;
  valor_total_nfe: string;
  chave_acesso: string;
  natureza_operacao: string;
  cfop?: string | null;
  cfop_indicado?: string | null;
  status_autorizacao: string;
  transportadora: string;
  local_entrega: string;
  explicacao: string;
  pedido: string;
  linha: string;
  icms_valor: string;
  pis_valor: string;
  cofins_valor: string;
  ipi_valor: string;
  simples_optante?: boolean | null;
}

interface NotasListProps {
  filterBySaquetto?: boolean;
  filterByTaxRegime?: TaxRegime;
}

export function NotasList({ filterBySaquetto, filterByTaxRegime: taxRegimeFilterProp = 'all' }: NotasListProps = {}) {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedNota, setSelectedNota] = useState<Nota | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadNotas();
  }, [filterBySaquetto, taxRegimeFilterProp]);

  const loadNotas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saquetto')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar notas:', error);
        return;
      }

      // Aplicar filtro por tipo de emitente se especificado
      let filteredData = data || [];
      if (filterBySaquetto !== undefined) {
        filteredData = filteredData.filter((nota: any) => 
          filterBySaquetto ? nota.emitente_saquetto === true : (nota.emitente_saquetto === false || nota.emitente_saquetto === null)
        );
      }
      
      setNotas(filteredData);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply tax regime filter first
  const taxRegimeFilteredNotas = filterByTaxRegime(notas, taxRegimeFilterProp);

  const filteredNotas = taxRegimeFilteredNotas.filter(nota => {
    const matchesSearch = 
      nota.numero_nfe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.destinatario_razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.emitente_razao_social?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || nota.situacao === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredNotas.length / itemsPerPage);
  const paginatedNotas = filteredNotas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (situacao: string) => {
    switch (situacao?.toLowerCase()) {
      case 'aprovado':
        return <Badge className="bg-success/10 text-success border-success/20"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'alerta':
        return <Badge className="bg-warning/10 text-warning border-warning/20"><AlertTriangle className="w-3 h-3 mr-1" />Alerta</Badge>;
      case 'reprovado':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="w-3 h-3 mr-1" />Reprovado</Badge>;
      default:
        return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />Pendente</Badge>;
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return 'R$ 0,00';
    const numValue = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
    return isNaN(numValue) ? 'R$ 0,00' : `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const downloadXML = async (nota: Nota) => {
    setDownloadingId(nota.id);
    try {
      const publicUrl = await getPublicInvoiceUrl(nota.id);
      
      if (!publicUrl) {
        alert('XML não disponível para esta nota fiscal');
        return;
      }

      // Fetch the file from storage
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }

      // Convert to blob
      const blob = await response.blob();
      
      // Create object URL and download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NFe-${nota.numero_nfe || nota.id}.xml`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao baixar XML:', error);
      alert('Erro ao fazer download do arquivo XML');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-gradient-card shadow-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lista de Notas Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por número da NFe, cliente ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Alerta">Alerta</SelectItem>
                <SelectItem value="Reprovado">Reprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredNotas.length} nota(s) encontrada(s)
          </div>
        </CardContent>
      </Card>

      {/* Lista de Notas */}
      <div className="space-y-4">
        {paginatedNotas.map((nota) => (
          <Card key={nota.id} className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">NFe {nota.numero_nfe}</h3>
                    {getStatusBadge(nota.situacao)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(nota.data_emissao)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {nota.destinatario_razao_social || nota.emitente_razao_social || 'N/A'}
                    </div>
                   <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(nota.valor_total_nfe)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      <Badge variant="outline" className="text-xs">
                        {getTaxRegimeShortLabel(nota.simples_optante)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadXML(nota)}
                    disabled={downloadingId === nota.id}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloadingId === nota.id ? 'Baixando...' : 'XML'}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedNota(nota)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Detalhes da NFe {nota.numero_nfe}</DialogTitle>
                    </DialogHeader>
                    
                    {selectedNota && (
                      <div className="space-y-6">
                        {/* Informações Gerais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Informações Gerais</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Chave de Acesso:</strong> {selectedNota.chave_acesso || 'N/A'}</div>
                              <div><strong>Data de Emissão:</strong> {formatDate(selectedNota.data_emissao)}</div>
                              <div><strong>Natureza da Operação:</strong> {selectedNota.natureza_operacao || 'N/A'}</div>
                              <div><strong>CFOP:</strong> {selectedNota.cfop || 'N/A'}</div>
                              <div><strong>CFOP indicado (entrada Saquetto):</strong> {selectedNota.cfop_indicado || 'N/A'}</div>
                              <div><strong>Status SEFAZ:</strong> {selectedNota.status_autorizacao || 'N/A'}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Logística</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Transportadora:</strong> {selectedNota.transportadora || 'N/A'}</div>
                              <div><strong>Local de Entrega:</strong> {selectedNota.local_entrega || 'N/A'}</div>
                              <div><strong>Pedido:</strong> {selectedNota.pedido || 'N/A'}</div>
                              <div><strong>Linha:</strong> {selectedNota.linha || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Tributos */}
                        <div>
                          <h4 className="font-semibold mb-2">Tributos</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground">ICMS</div>
                              <div className="font-semibold">{formatCurrency(selectedNota.icms_valor)}</div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground">PIS</div>
                              <div className="font-semibold">{formatCurrency(selectedNota.pis_valor)}</div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground">COFINS</div>
                              <div className="font-semibold">{formatCurrency(selectedNota.cofins_valor)}</div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground">IPI</div>
                              <div className="font-semibold">{formatCurrency(selectedNota.ipi_valor)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Observações */}
                        {selectedNota.explicacao && (
                          <div>
                            <h4 className="font-semibold mb-2">Explicação/Observações</h4>
                            <div className="bg-muted/50 p-4 rounded-lg text-sm">
                              {selectedNota.explicacao}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredNotas.length === 0 && (
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma nota encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termos de busca.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}