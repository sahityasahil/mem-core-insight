
import React, { useState } from 'react';
import { Calculator, Memory, Cpu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CalculationResults {
  ddramUsagePercent: number;
  ddramUsageMB: number;
  cpuLoadPercent: number;
  cpuIdlePercent: number;
}

const MemoryCalculator = () => {
  const [totalMemory, setTotalMemory] = useState<string>('');
  const [availableMemory, setAvailableMemory] = useState<string>('');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<string>('');

  const calculateValues = () => {
    const total = parseFloat(totalMemory);
    const available = parseFloat(availableMemory);

    // Input validation
    if (!totalMemory || !availableMemory || isNaN(total) || isNaN(available)) {
      setErrors('Please enter valid numeric values for both fields');
      setResults(null);
      return;
    }

    if (total <= 0 || available < 0) {
      setErrors('Total memory must be positive and available memory cannot be negative');
      setResults(null);
      return;
    }

    if (available > total) {
      setErrors('Available memory cannot be greater than total memory');
      setResults(null);
      return;
    }

    setErrors('');

    // Calculations based on your formulas
    const ddramUsagePercent = ((total - available) / total) * 100;
    const ddramUsageMB = (ddramUsagePercent / 100) * total;
    const cpuLoadPercent = ((1024 - available) / 1024) * 100;
    const cpuIdlePercent = 100 - cpuLoadPercent;

    setResults({
      ddramUsagePercent: parseFloat(ddramUsagePercent.toFixed(3)),
      ddramUsageMB: parseFloat(ddramUsageMB.toFixed(3)),
      cpuLoadPercent: parseFloat(cpuLoadPercent.toFixed(3)),
      cpuIdlePercent: parseFloat(cpuIdlePercent.toFixed(3))
    });
  };

  const handleClear = () => {
    setTotalMemory('');
    setAvailableMemory('');
    setResults(null);
    setErrors('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Calculator className="h-10 w-10 text-blue-600" />
          Memory & CPU Calculator
        </h1>
        <p className="text-lg text-gray-600">Calculate DDRAM usage and CPU load metrics</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Memory className="h-5 w-5 text-green-600" />
              Memory Inputs
            </CardTitle>
            <CardDescription>
              Enter your memory values in MB to calculate usage metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalMemory">Total Memory (MB)</Label>
              <Input
                id="totalMemory"
                type="number"
                placeholder="e.g., 8192"
                value={totalMemory}
                onChange={(e) => setTotalMemory(e.target.value)}
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availableMemory">Available Memory (MB)</Label>
              <Input
                id="availableMemory"
                type="number"
                placeholder="e.g., 4096"
                value={availableMemory}
                onChange={(e) => setAvailableMemory(e.target.value)}
                className="text-lg"
              />
            </div>

            {errors && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{errors}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={calculateValues} className="flex-1">
                Calculate
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-600" />
              Calculation Results
            </CardTitle>
            <CardDescription>
              GIP core metrics based on your input values
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">DDRAM Usage</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-blue-700">
                        Percentage: <span className="font-mono font-bold">{results.ddramUsagePercent}%</span>
                      </p>
                      <p className="text-sm text-blue-700">
                        Memory Used: <span className="font-mono font-bold">{results.ddramUsageMB} MB</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">CPU Load</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-green-700">
                        Load: <span className="font-mono font-bold">{results.cpuLoadPercent}%</span>
                      </p>
                      <p className="text-sm text-green-700">
                        Idle: <span className="font-mono font-bold">{results.cpuIdlePercent}%</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Total Memory: {totalMemory} MB</p>
                    <p>Available Memory: {availableMemory} MB</p>
                    <p>Used Memory: {parseFloat(totalMemory) - parseFloat(availableMemory)} MB</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Enter memory values and click Calculate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Formula Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Formula Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">DDRAM Usage Calculations:</h4>
              <p className="font-mono bg-gray-100 p-2 rounded">
                Usage % = ((Total - Available) / Total) × 100
              </p>
              <p className="font-mono bg-gray-100 p-2 rounded">
                Usage MB = (Usage % / 100) × Total Memory
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">CPU Load Calculations:</h4>
              <p className="font-mono bg-gray-100 p-2 rounded">
                Load % = ((1024 - Available) / 1024) × 100
              </p>
              <p className="font-mono bg-gray-100 p-2 rounded">
                Idle % = 100 - Load %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryCalculator;
