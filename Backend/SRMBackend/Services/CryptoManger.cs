using SRMBackend.IService;
using System.Security.Cryptography;

namespace SRMBackend.Services
{
    public class CryptoManger : ICryptoManger
    {
        private const int SaltSize = 16;       // 128 bits
        private const int KeySize = 32;        // 256 bits
        private const int Iterations = 350000;
        private readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;


        public (string HashHex, string SaltHex) HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);

            byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                Iterations,
                Algorithm,
                KeySize);

            return (Convert.ToHexString(hash), Convert.ToHexString(salt));
        }


        public bool VerifyPassword(string inputPassword, string storedHashHex, string storedSaltHex)
        {
            byte[] storedHash = Convert.FromHexString(storedHashHex);
            byte[] storedSalt = Convert.FromHexString(storedSaltHex);

            byte[] computedHash = Rfc2898DeriveBytes.Pbkdf2(
                inputPassword,
                storedSalt,
                Iterations,
                Algorithm,
                KeySize);

            return CryptographicOperations.FixedTimeEquals(computedHash, storedHash);
        }
    }
}
