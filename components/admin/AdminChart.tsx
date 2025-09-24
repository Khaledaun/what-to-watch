interface ChartData {
  name: string;
  value: number;
}

interface AdminChartProps {
  title: string;
  data: ChartData[];
  type: 'bar' | 'pie' | 'line';
}

export function AdminChart({ title, data, type }: AdminChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {type === 'bar' && (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-12 text-sm text-gray-600">{item.name}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-8 text-sm text-gray-900">{item.value}</div>
            </div>
          ))}
        </div>
      )}
      
      {type === 'pie' && (
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="text-sm text-gray-900">
                  {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {type === 'line' && (
        <div className="h-32 flex items-end space-x-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-blue-500 rounded-t"
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                width: `${100 / data.length}%`
              }}
              title={`${item.name}: ${item.value}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
