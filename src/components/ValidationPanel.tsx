import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import type { NotaFiscal } from '@/types/notaFiscal';
import {
  validateNotaFiscal,
  getValidationExplanation,
  type ValidationResult
} from '@/lib/notaFiscalValidator';
import { updateNotaStatus } from '@/lib/statusUpdate';
import { toast } from '@/hooks/use-toast';

interface ValidationPanelProps {
  nota: NotaFiscal;
  onValidationComplete?: () => void;
}

export function ValidationPanel({ nota, onValidationComplete }: ValidationPanelProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleValidate = () => {
    setIsValidating(true);

    // Simular delay para UX (validação é instantânea)
    setTimeout(() => {
      const result = validateNotaFiscal(nota);
      setValidationResult(result);
      setIsValidating(false);
      setShowDetails(true);

      // Toast notification
      if (result.isValid) {
        toast({
          title: '✅ Validação concluída',
          description: 'Nenhum erro encontrado nesta nota fiscal.',
        });
      } else {
        toast({
          title: result.suggestedStatus === 'Reprovado' ? '❌ Erros encontrados' : '⚠️ Alertas encontrados',
          description: `${result.errors.length} erro(s) e ${result.warnings.length} alerta(s) detectados.`,
          variant: result.suggestedStatus === 'Reprovado' ? 'destructive' : 'default',
        });
      }
    }, 800);
  };

  const handleApplySuggestion = async () => {
    if (!validationResult) return;

    const currentStatus = nota.situacao || 'Alerta';
    const suggestedStatus = validationResult.suggestedStatus;

    if (currentStatus === suggestedStatus) {
      toast({
        title: 'Nenhuma alteração necessária',
        description: `O status atual já é "${suggestedStatus}".`,
      });
      return;
    }

    setIsApplying(true);

    try {
      const explanation = getValidationExplanation(validationResult);

      const result = await updateNotaStatus({
        notaId: nota.id,
        statusAtual: currentStatus,
        statusNovo: suggestedStatus,
        motivo: `Validação automática do sistema:\n${explanation}`
      });

      if (result.success) {
        toast({
          title: 'Status atualizado',
          description: `Status alterado de "${currentStatus}" para "${suggestedStatus}".`,
        });

        if (onValidationComplete) {
          onValidationComplete();
        }
      } else {
        toast({
          title: 'Erro ao atualizar status',
          description: result.error || 'Erro desconhecido',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao aplicar sugestão',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Aprovado': 'default',
      'Alerta': 'secondary',
      'Reprovado': 'destructive'
    } as const;

    const icons = {
      'Aprovado': CheckCircle,
      'Alerta': AlertTriangle,
      'Reprovado': XCircle
    };

    const Icon = icons[status as keyof typeof icons] || AlertTriangle;
    const variant = variants[status as keyof typeof variants] || 'secondary';

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Validação Automática
          </span>
          <Button
            onClick={handleValidate}
            disabled={isValidating}
            size="sm"
            variant="outline"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Validar Nota
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!validationResult && !isValidating && (
          <Alert>
            <AlertDescription>
              Clique em "Validar Nota" para verificar se todos os dados estão corretos segundo as regras de negócio.
            </AlertDescription>
          </Alert>
        )}

        {validationResult && (
          <div className="space-y-4">
            {/* Resultado Principal */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Status Atual</p>
                {getStatusBadge(nota.situacao || 'Alerta')}
              </div>
              <div className="text-2xl">→</div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Status Sugerido</p>
                {getStatusBadge(validationResult.suggestedStatus)}
              </div>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {validationResult.isValid ? '✓' : validationResult.errors.length === 0 ? '✓' : '✗'}
                </p>
                <p className="text-xs text-muted-foreground">Aprovado</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded text-center">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {validationResult.warnings.length}
                </p>
                <p className="text-xs text-muted-foreground">Alertas</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {validationResult.errors.length}
                </p>
                <p className="text-xs text-muted-foreground">Erros</p>
              </div>
            </div>

            {/* Detalhes */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full justify-between"
              >
                <span>Detalhes da Validação</span>
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>

              {showDetails && (
                <div className="mt-3 space-y-3">
                  {validationResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <XCircle className="w-4 h-4" />
                      <AlertDescription className="mt-2">
                        <p className="font-semibold mb-2">Erros Críticos:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {validationResult.errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="mt-2">
                        <p className="font-semibold mb-2">Alertas:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {validationResult.warnings.map((warning, idx) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {validationResult.errors.length === 0 && validationResult.warnings.length === 0 && (
                    <Alert>
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>
                        ✅ Todos os dados estão corretos! Nenhum problema encontrado.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            {/* Ações */}
            {nota.situacao !== validationResult.suggestedStatus && (
              <div className="flex gap-2">
                <Button
                  onClick={handleApplySuggestion}
                  disabled={isApplying}
                  className="flex-1"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Aplicando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aplicar Sugestão
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
