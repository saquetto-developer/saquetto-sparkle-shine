import { InvoiceMigration } from '@/components/InvoiceMigration';

export default function Migration() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Data Migration</h1>
        <p className="text-muted-foreground mt-2">
          Migrate invoice data from the legacy base64 table to Supabase Storage
        </p>
      </div>
      
      <InvoiceMigration />
    </div>
  );
}
