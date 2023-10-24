using AuthenticationAPI.Interfaces;
using System.Text.RegularExpressions;

namespace AuthenticationAPI.Services
{
    public class CpfService : ICpfService
    {
        public bool Validate(string cpf)
        {
            var cpfNumbers = Clear(cpf);

            if (!IsCpfLengthValid(cpfNumbers)) 
                return false;

            if (IsRepeatedDigits(cpfNumbers)) 
                return false;

            string tempCpf = cpfNumbers.Substring(0, 9);
            int[] multiplier1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplier2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            int sum = CalculateSum(tempCpf, multiplier1);
            int remainder = CalculateRemainder(sum);

            string calculatedDigit = remainder.ToString();
            tempCpf = tempCpf + calculatedDigit;
            sum = CalculateSum(tempCpf, multiplier2);
            remainder = CalculateRemainder(sum);
            calculatedDigit = calculatedDigit + remainder.ToString();

            return cpf.EndsWith(calculatedDigit);
        }

        private static string Clear(string cpf)
        {
            return Regex.Replace(cpf, @"[^\d]", string.Empty);
        }

        private bool IsCpfLengthValid(string cpf)
        {
            return cpf.Length == 11;
        }

        private bool IsRepeatedDigits(string cpf)
        {
            for (int j = 0; j < 10; j++)
            {
                if (j.ToString().PadLeft(11, char.Parse(j.ToString())) == cpf)
                {
                    return true;
                }
            }
            return false;
        }

        private int CalculateSum(string tempCpf, int[] multiplier)
        {
            int sum = 0;
            for (int i = 0; i < 9; i++)
            {
                sum += int.Parse(tempCpf[i].ToString()) * multiplier[i];
            }
            return sum;
        }

        private int CalculateRemainder(int sum)
        {
            int remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        }
    }
}
