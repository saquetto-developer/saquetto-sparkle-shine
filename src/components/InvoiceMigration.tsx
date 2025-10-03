import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  batchMigrateAllInvoices, 
  getMigrationStats,
  type MigrationResult 
} from '@/lib/invoiceStorage';
import { Database, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export function InvoiceMigration() {
  const [stats, setStats] = useState({ totalInBase64: 0, totalInStorage: 0, needsMigration: 0 });
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState({ total: 0, completed: 0, failed: 0 });
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoadingStats(true);
    const migrationStats = await getMigrationStats();
    setStats(migrationStats);
    setIsLoadingStats(false);
  };

  const handleMigration = async () => {
    if (stats.needsMigration === 0) {
      toast.info('No records to migrate');
      return;
    }

    setIsMigrating(true);
    setResults([]);
    setProgress({ total: stats.needsMigration, completed: 0, failed: 0 });

    toast.info('Starting migration...');

    const migrationResults = await batchMigrateAllInvoices(5, (prog) => {
      setProgress(prog);
    });

    setResults(migrationResults);
    setIsMigrating(false);

    const successCount = migrationResults.filter(r => r.success).length;
    const failCount = migrationResults.filter(r => !r.success).length;

    if (failCount === 0) {
      toast.success(`Successfully migrated ${successCount} invoices to storage`);
    } else {
      toast.warning(`Migrated ${successCount} invoices, ${failCount} failed`);
    }

    // Reload stats after migration
    await loadStats();
  };

  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed + progress.failed) / progress.total * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Invoice Storage Migration
        </CardTitle>
        <CardDescription>
          Migrate invoice XML data from database to Supabase Storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Base64 Table</p>
            <p className="text-2xl font-bold">{isLoadingStats ? '...' : stats.totalInBase64}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">In Storage</p>
            <p className="text-2xl font-bold">{isLoadingStats ? '...' : stats.totalInStorage}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Needs Migration</p>
            <p className="text-2xl font-bold text-orange-600">{isLoadingStats ? '...' : stats.needsMigration}</p>
          </div>
        </div>

        {/* Migration Progress */}
        {isMigrating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Migrating...</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Completed: {progress.completed}</span>
              <span>Failed: {progress.failed}</span>
              <span>Total: {progress.total}</span>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && !isMigrating && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Successful: {results.filter(r => r.success).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>Failed: {results.filter(r => !r.success).length}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Failed Migrations Details */}
        {results.some(r => !r.success) && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Failed Migrations
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {results
                .filter(r => !r.success)
                .map(r => (
                  <div key={r.saquettoId} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                    <span>Saquetto ID: {r.saquettoId}</span>
                    <Badge variant="destructive" className="text-xs">
                      {r.error || 'Failed'}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleMigration}
            disabled={isMigrating || isLoadingStats || stats.needsMigration === 0}
            className="flex-1"
          >
            {isMigrating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Migrating...
              </>
            ) : (
              'Start Migration'
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={loadStats}
            disabled={isMigrating || isLoadingStats}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {stats.needsMigration === 0 && !isLoadingStats && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              All invoices have been migrated to storage
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
