import React, {useEffect, useState} from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@/components/ui/table"
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Activity } from "lucide-react";

const SuspiciousAppsTable = () => {
    const [sortedApps, setSortedApps] = useState([]);

    useEffect(() => {

        const fetchSuspiciousApps = async() => {
            const response = await axios.get("http://127.0.0.1:8000/suspicious-activity")
            const rawLogs = response.data.suspicious_apps

            const sorted = [...rawLogs].sort((a, b) => {
                return new Date(b.lastSeen) - new Date(a.lastSeen);
            });

            setSortedApps(sorted);
        }

        fetchSuspiciousApps();
    }, []);

    return (
        <Card className="mt-10 pb-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <span>Recent App Activity</span>
              <Badge variant="outline" className="ml-auto">
                {sortedApps.length} apps monitored
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold text-foreground py-4 px-6 text-md">
                      Application
                    </TableHead>
                    <TableHead className="font-semibold text-foreground py-4 px-6 text-md">
                      Reason
                    </TableHead>
                    <TableHead className="font-semibold text-foreground py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 mt-1" />
                        <span className="text-md">Last Seen</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedApps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center space-y-3">
                          <Activity className="w-12 h-12 opacity-50" />
                          <p>No recent app activity detected</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedApps.map((app, index) => (
                      <TableRow 
                        key={index} 
                        className="hover:bg-muted/30 transition-colors border-b last:border-b-0"
                      >
                        <TableCell className="font-medium py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-foreground text-sm">{app.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge 
                            variant="secondary"
                            className="text-sm"
                          >
                            {app.reason}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {new Date(app.lastSeen).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="text-xs opacity-70">
                              {Math.round((Date.now() - new Date(app.lastSeen).getTime()) / 86400000)} days ago
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    )
}

export default SuspiciousAppsTable;