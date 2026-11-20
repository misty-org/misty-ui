import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../src";

export const meta = { name: "Table", file: "display/Table.tsx", about: "", wide: false, order: 19 };

export default function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {["Weekly plan", "Research notes"].map((name) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>2h</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
