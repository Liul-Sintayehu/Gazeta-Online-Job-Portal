namespace FSC.Service.Utility
{
    public static class Logger
    {
        public static void LogInformation(string threading, string userComment, string? exceptiomMessage, string? innerExceptionMessage)
        {
            try
            {
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ErrorLogs", DateTime.Now.ToString("MMM_yyyy"), DateTime.Now.ToString("ddMMyyyy"));
                Directory.CreateDirectory(path);
                path = Path.Combine(path, threading + "Log_" + DateTime.Now.ToString("ddMMyyyy") + ".txt");

                var fs = new FileStream(path, FileMode.Append, FileAccess.Write);
                var sw = new StreamWriter(fs);
                sw.WriteLine("-- " + DateTime.Now + "  -------------------------------------------------------------------");
                sw.WriteLine("User Comment:" + userComment);
                if (!string.IsNullOrEmpty(exceptiomMessage))
                    sw.WriteLine("Exception Message:" + exceptiomMessage);
                if (!string.IsNullOrEmpty(innerExceptionMessage))
                    sw.WriteLine("Inner Exception Message:" + innerExceptionMessage);
                sw.WriteLine("-------------------------------------------------------------------------------------------\r");
                sw.Flush();

                sw.Close();
                fs.Close();
            }
            catch (Exception)
            {
            }
        }

    }
}
