using SAP.Middleware.Connector;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Text.Json;

namespace FSC.Console
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                // Ensure that the correct number of arguments are passed
                if (args.Length < 2)
                {
                    System.Console.Error.WriteLine($"Error: Please provide Function Name, Table Name, and Parameters. Arguments count: {args.Length}");
                    return;
                }

                // Extract Function Name and Table Name from arguments
                string functionName = args[0];  // First argument: SAP Function Name
                string tableName = args[1];     // Table Name (second argument)

                // Collect dynamic parameters
                var parameters = new Dictionary<string, string>();

                // Process the remaining arguments as key-value pairs (e.g., empId=20727, date=2013-01-01)
                for (int i = 2; i < args.Length; i++)
                {
                    var param = args[i].Split('=');
                    if (param.Length == 2)
                    {
                        parameters.Add(param[0], param[1]);
                    }
                    else
                    {
                        System.Console.Error.WriteLine($"Invalid parameter format: {args[i]}");
                        return;
                    }
                }

                // Initialize SAP Service
                var sapService = new SapService();

                // Invoke SAP function with parameters
                string jsonResult = sapService.InvokeSAPFunction(functionName, parameters, tableName);

                // Output the JSON result
                System.Console.WriteLine(jsonResult);
            }
            catch (Exception ex)
            {
                System.Console.Error.WriteLine($"Error: {ex.Message}");
            }
        }
    }

    public class SapService
    {
        private RfcDestination sapDestination;

        public SapService()
        {
            InitializeSAPConnection();
        }
        private void InitializeSAPConnection()
        {
            try
            {
                var destinationConfig = new RfcConfigParameters
                        {
                            { RfcConfigParameters.AppServerHost, ConfigurationManager.AppSettings["SAP.AppServerHost"] },
                            { RfcConfigParameters.SystemNumber, ConfigurationManager.AppSettings["SAP.SystemNumber"] },
                            { RfcConfigParameters.User, ConfigurationManager.AppSettings["SAP.User"] },
                            { RfcConfigParameters.Password, ConfigurationManager.AppSettings["SAP.Password"] },
                            { RfcConfigParameters.Client, ConfigurationManager.AppSettings["SAP.Client"] },
                            { RfcConfigParameters.Language, ConfigurationManager.AppSettings["SAP.Language"] },
                            { RfcConfigParameters.PoolSize, ConfigurationManager.AppSettings["SAP.PoolSize"] },
                            { RfcConfigParameters.Name, ConfigurationManager.AppSettings["SAP.Name"] }
                        };

                sapDestination = RfcDestinationManager.GetDestination(destinationConfig);

                if (sapDestination != null)
                {
                    sapDestination.Ping();
                    System.Console.WriteLine("SAP connection established.");
                }
                else
                {
                    System.Console.WriteLine("Failed to establish SAP connection.");
                }
            }
            catch (Exception ex)
            {
                System.Console.Error.WriteLine($"Error initializing SAP connection: {ex.Message}");
            }
        }
        public string InvokeSAPFunction(string functionName, Dictionary<string, string> parameters, string tableName)
        {
            if (sapDestination == null)
            {
                System.Console.Error.WriteLine("SAP destination is not initialized.");
                return string.Empty;
            }

            try
            {
                RfcRepository repo = sapDestination.Repository;
                IRfcFunction func = repo.CreateFunction(functionName);

                // Set function parameters dynamically
                foreach (var param in parameters)
                {
                    func.SetValue(param.Key, param.Value);
                }

                // Call the SAP function
                func.Invoke(sapDestination);

                // Extract the return table dynamically
                IRfcTable resultTable = func.GetTable(tableName);
                var results = new List<Dictionary<string, string>>();

                foreach (IRfcStructure row in resultTable)
                {
                    var rowData = new Dictionary<string, string>();

                    // Iterate through the fields using field index
                    for (int i = 0; i < row.Count; i++)
                    {
                        // Get the value of each field by its index
                        string fieldValue = row.GetString(i);
                        rowData[$"Field_{i}"] = fieldValue; // Use index or actual field name if available
                    }

                    results.Add(rowData);
                }

                // Convert the results to JSON string
                return JsonSerializer.Serialize(results);
            }
            catch (Exception ex)
            {
                System.Console.Error.WriteLine($"Error invoking SAP function: {ex.Message}");
                return string.Empty;
            }
        }
    }
}