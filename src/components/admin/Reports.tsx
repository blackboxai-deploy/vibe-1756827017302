"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import { usePOS } from '@/hooks/use-pos';

export function Reports() {
  const { salesData, generateXReport, generateZReport } = usePOS();

  const handleXReport = () => {
    const report = generateXReport();
    const reportWindow = window.open('', '_blank', 'width=600,height=500');
    
    if (reportWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>X Report - Fusion Eats</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                margin: 20px; 
                background: #f5f5f5; 
              }
              .receipt { 
                background: white; 
                padding: 20px; 
                max-width: 400px; 
                margin: 0 auto;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header { 
                text-align: center; 
                border-bottom: 2px solid #333; 
                padding-bottom: 10px; 
                margin-bottom: 20px; 
              }
              .line { 
                display: flex; 
                justify-content: space-between; 
                margin: 5px 0; 
              }
              .total { 
                border-top: 1px solid #333; 
                margin-top: 10px; 
                padding-top: 10px; 
                font-weight: bold; 
              }
              @media print {
                body { background: white; margin: 0; }
                .receipt { box-shadow: none; max-width: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h1>FUSION EATS</h1>
                <h2>X REPORT (DAILY SALES)</h2>
                <p>${new Date().toLocaleString()}</p>
              </div>
              
              <div class="line">
                <span>Daily Sales:</span>
                <span>£${report.dailySales.toFixed(2)}</span>
              </div>
              <div class="line">
                <span>Transaction Count:</span>
                <span>${report.transactionCount}</span>
              </div>
              <div class="line">
                <span>Average Transaction:</span>
                <span>£${report.transactionCount > 0 ? (report.dailySales / report.transactionCount).toFixed(2) : '0.00'}</span>
              </div>
              
              <div class="total">
                <div class="line">
                  <span>DAILY TOTAL:</span>
                  <span>£${report.dailySales.toFixed(2)}</span>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px; font-size: 12px;">
                <p>This is a daily sales report (X Report)</p>
                <p>Totals are NOT reset after printing</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 20px;">
              <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">Print Report</button>
            </div>
          </body>
        </html>
      `;
      
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
    }
  };

  const handleZReport = () => {
    if (confirm('Z Report will reset all cumulative totals. This action cannot be undone. Continue?')) {
      const report = generateZReport();
      const reportWindow = window.open('', '_blank', 'width=600,height=500');
      
      if (reportWindow) {
        const htmlContent = `
          <html>
            <head>
              <title>Z Report - Fusion Eats</title>
              <style>
                body { 
                  font-family: 'Courier New', monospace; 
                  margin: 20px; 
                  background: #f5f5f5; 
                }
                .receipt { 
                  background: white; 
                  padding: 20px; 
                  max-width: 400px; 
                  margin: 0 auto;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header { 
                  text-align: center; 
                  border-bottom: 2px solid #333; 
                  padding-bottom: 10px; 
                  margin-bottom: 20px; 
                }
                .line { 
                  display: flex; 
                  justify-content: space-between; 
                  margin: 5px 0; 
                }
                .total { 
                  border-top: 1px solid #333; 
                  margin-top: 10px; 
                  padding-top: 10px; 
                  font-weight: bold; 
                }
                .warning {
                  background: #ffebcc;
                  border: 1px solid #ff9900;
                  padding: 10px;
                  margin: 10px 0;
                  border-radius: 4px;
                }
                @media print {
                  body { background: white; margin: 0; }
                  .receipt { box-shadow: none; max-width: none; }
                }
              </style>
            </head>
            <body>
              <div class="receipt">
                <div class="header">
                  <h1>FUSION EATS</h1>
                  <h2>Z REPORT (END OF DAY)</h2>
                  <p>${new Date().toLocaleString()}</p>
                </div>
                
                <div class="line">
                  <span>Cumulative Sales:</span>
                  <span>£${report.cumulativeSales.toFixed(2)}</span>
                </div>
                <div class="line">
                  <span>Total Transactions:</span>
                  <span>${report.transactionCount}</span>
                </div>
                <div class="line">
                  <span>Average Transaction:</span>
                  <span>£${report.transactionCount > 0 ? (report.cumulativeSales / report.transactionCount).toFixed(2) : '0.00'}</span>
                </div>
                
                <div class="total">
                  <div class="line">
                    <span>GRAND TOTAL:</span>
                    <span>£${report.cumulativeSales.toFixed(2)}</span>
                  </div>
                </div>
                
                <div class="warning">
                  <strong>⚠️ TOTALS HAVE BEEN RESET</strong><br/>
                  All cumulative totals have been reset to zero after printing this Z Report.
                </div>
                
                <div style="text-align: center; margin-top: 20px; font-size: 12px;">
                  <p>This is an end-of-day report (Z Report)</p>
                  <p>All totals have been reset to zero</p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">Print Report</button>
              </div>
            </body>
          </html>
        `;
        
        reportWindow.document.write(htmlContent);
        reportWindow.document.close();
      }
    }
  };

  const cashTransactions = salesData.transactions.filter(t => t.paymentMethod === 'cash');
  const cardTransactions = salesData.transactions.filter(t => t.paymentMethod === 'card');
  const cashTotal = cashTransactions.reduce((sum, t) => sum + t.amount, 0);
  const cardTotal = cardTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Report Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>X Report (Daily Sales)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View daily sales totals without resetting counters. Use this for mid-day reports and checking current performance.
            </p>
            <Button onClick={handleXReport} className="w-full bg-blue-600 hover:bg-blue-700">
              Generate X Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Z Report (End of Day)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Print end-of-day report and reset all totals to zero. Use this at closing time only.
            </p>
            <Button onClick={handleZReport} className="w-full bg-red-600 hover:bg-red-700">
              Generate Z Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              £{salesData.dailySales.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Today's total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cumulative Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              £{salesData.cumulativeSales.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Since last Z report</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {salesData.transactions.length}
            </div>
            <p className="text-sm text-gray-600">Total transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Cash Payments</span>
                <Badge variant="outline">{cashTransactions.length} transactions</Badge>
              </div>
              <div className="text-2xl font-bold text-green-600">
                £{cashTotal.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Card Payments</span>
                <Badge variant="outline">{cardTransactions.length} transactions</Badge>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                £{cardTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {salesData.transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions yet today</p>
            ) : (
              <div className="space-y-2">
                {[...salesData.transactions].reverse().slice(0, 20).map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={transaction.paymentMethod === 'cash' ? 'default' : 'secondary'}>
                          {transaction.paymentMethod.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="font-bold text-green-600">
                        £{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}: {' '}
                      {transaction.items.map(item => `${item.product.name} (${item.quantity})`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}