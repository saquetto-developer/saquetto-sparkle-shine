import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { updateNotaStatus, type StatusHistoryEntry } from '@/lib/statusUpdate';
import { toast } from '@/hooks/use-toast';

interface StatusChangeFormProps {
  notaId: number;
  currentStatus: string;
  onSuccess: () => void;
  onCancel?: () => void; // Callback to close modal when canceling
  statusHistory?: StatusHistoryEntry[];
}

const STATUS_OPTIONS = [
  { value: 'Aprovado', label: 'Aprovado', variant: 'default' as const },
  { value: 'Alerta', label: 'Alerta', variant: 'secondary' as const },
  { value: 'Reprovado', label: 'Reprovado', variant: 'destructive' as const },
];

export function StatusChangeForm({
  notaId,
  currentStatus,
  onSuccess,
  onCancel,
  statusHistory = [],
}: StatusChangeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [novoStatus, setNovoStatus] = useState<string>('');
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!novoStatus) {
      toast({
        title: 'Erro',
        description: 'Selecione um novo status',
        variant: 'destructive',
      });
      return;
    }

    if (novoStatus === currentStatus) {
      toast({
        title: 'Erro',
        description: 'O novo status deve ser diferente do atual',
        variant: 'destructive',
      });
      return;
    }

    if (motivo.trim().length < 10) {
      toast({
        title: 'Erro',
        description: 'A justificativa deve ter pelo menos 10 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateNotaStatus({
        notaId,
        statusAtual: currentStatus,
        statusNovo: novoStatus,
        motivo: motivo.trim(),
      });

      if (result.success) {
        toast({
          title: 'Status atualizado',
          description: `Status alterado de ${currentStatus} para ${novoStatus} com sucesso.`,
        });

        // Reset form
        setNovoStatus('');
        setMotivo('');
        setIsOpen(false); // Close collapsible

        // Notify parent component
        onSuccess();
      } else {
        toast({
          title: 'Erro ao atualizar status',
          description: result.error || 'Erro desconhecido',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // If user has entered data, confirm before closing
    const hasChanges = novoStatus !== '' || motivo.trim() !== '';

    if (hasChanges) {
      const confirmed = window.confirm(
        'Você possui alterações não salvas. Deseja descartar e fechar?'
      );

      if (!confirmed) return;
    }

    // Reset form
    setNovoStatus('');
    setMotivo('');
    setIsOpen(false);

    // Call parent cancel callback to close modal
    if (hasChanges && onCancel) {
      onCancel();
    }
  };

  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus);

  return (
    <div className="space-y-6">
      {/* Status Change Section - Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Alterar Status</h3>
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {isOpen ? (
                <>
                  Fechar
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Alterar Status
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-4 mt-4">
          {/* Current Status */}
          <div>
            <Label className="text-sm text-muted-foreground">Status Atual</Label>
            <div className="mt-1">
              <Badge
                variant={currentStatusOption?.variant}
                className={
                  currentStatus === 'Alerta'
                    ? 'bg-warning/10 text-warning border-warning/20'
                    : ''
                }
              >
                {currentStatus}
              </Badge>
            </div>
          </div>

          {/* New Status Select */}
          <div>
            <Label htmlFor="novo-status">Novo Status *</Label>
            <Select value={novoStatus} onValueChange={setNovoStatus}>
              <SelectTrigger id="novo-status" className="mt-1">
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value === currentStatus}
                  >
                    {option.label}
                    {option.value === currentStatus && ' (atual)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Justification Textarea */}
          <div>
            <Label htmlFor="motivo">
              Justificativa *
              <span className="text-xs text-muted-foreground ml-1">
                (mínimo 10 caracteres)
              </span>
            </Label>
            <Textarea
              id="motivo"
              placeholder="Explique o motivo da alteração do status..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 min-h-[100px]"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {motivo.trim().length} / 10 caracteres
              </p>
              {motivo.trim().length >= 10 && (
                <CheckCircle className="h-4 w-4 text-success" />
              )}
              {motivo.trim().length > 0 && motivo.trim().length < 10 && (
                <AlertCircle className="h-4 w-4 text-warning" />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !novoStatus ||
                novoStatus === currentStatus ||
                motivo.trim().length < 10
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alteração'
              )}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* History Section */}
      {statusHistory.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Histórico de Alterações</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {statusHistory.map((entry) => (
              <div
                key={entry.id}
                className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.status_anterior}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge variant="outline" className="text-xs">
                      {entry.status_novo}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">{entry.usuario_email}</span>
                </div>
                <div className="text-xs italic bg-background/50 p-2 rounded">
                  "{entry.motivo}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
