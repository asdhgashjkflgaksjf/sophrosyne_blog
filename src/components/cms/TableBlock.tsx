/**
 * CMS Table Block Component
 */

interface TableBlockProps {
  headers?: string[];
  rows?: { cells: string[] }[];
  caption?: string;
}

const TableBlock = ({ headers, rows, caption }: TableBlockProps) => {
  if (!rows || rows.length === 0) return null;

  return (
    <figure className="my-8 overflow-hidden">
      <div className="overflow-x-auto border border-[hsl(var(--sepia)/0.3)] rounded-lg">
        <table className="w-full border-collapse">
          {headers && headers.length > 0 && (
            <thead>
              <tr className="bg-[hsl(var(--paper-aged))]">
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-caps text-xs tracking-wider text-muted-foreground border-b border-[hsl(var(--sepia)/0.2)]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[hsl(var(--sepia)/0.1)] hover:bg-[hsl(var(--paper-aged)/0.3)] transition-colors"
              >
                {row.cells?.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm font-body text-foreground"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground font-script italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default TableBlock;
