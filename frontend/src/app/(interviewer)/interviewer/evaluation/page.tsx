import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function EvaluationPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold">Candidate Evaluation</h1>
            <p>Submit your feedback and scores for candidates.</p>
        </div>
    );
}
