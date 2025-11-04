import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveTableProps {
  data: any[]
  columns: {
    key: string
    title: string
    render?: (value: any, row: any) => React.ReactNode
    className?: string
  }[]
  title?: string
  description?: string
  emptyMessage?: string
  itemsPerPage?: number
}

export function ResponsiveTable({ 
  data, 
  columns, 
  title, 
  description,
  emptyMessage = "Nenhum item encontrado",
  itemsPerPage = 10 
}: ResponsiveTableProps) {
  const isMobile = useIsMobile()
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRows(newExpanded)
  }

  const renderCellValue = (column: typeof columns[0], value: any, row: any) => {
    if (column.render) {
      return column.render(value, row)
    }
    return value
  }

  if (isMobile) {
    return (
      <Card>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle className="text-lg">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className="p-0">
          {paginatedData.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="divide-y">
              {paginatedData.map((row, index) => {
                const isExpanded = expandedRows.has(index)
                const primaryColumn = columns[0]
                const secondaryColumn = columns[1]
                const remainingColumns = columns.slice(2)

                return (
                  <div key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {renderCellValue(primaryColumn, row[primaryColumn.key], row)}
                        </div>
                        {secondaryColumn && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {renderCellValue(secondaryColumn, row[secondaryColumn.key], row)}
                          </div>
                        )}
                      </div>
                      
                      {remainingColumns.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(index)}
                          className="h-8 w-8 p-0 shrink-0 ml-2"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    {isExpanded && remainingColumns.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {remainingColumns.map((column) => (
                          <div key={column.key} className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground font-medium">
                              {column.title}
                            </span>
                            <div className="text-xs">
                              {renderCellValue(column, row[column.key], row)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          
          {/* Mobile Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Desktop table view
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th 
                    key={column.key} 
                    className={cn(
                      "text-left p-3 text-sm font-medium text-muted-foreground",
                      column.className
                    )}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center p-6 text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    {columns.map((column) => (
                      <td 
                        key={column.key} 
                        className={cn("p-3 text-sm", column.className)}
                      >
                        {renderCellValue(column, row[column.key], row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Desktop Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)} de {data.length} itens
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}