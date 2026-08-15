namespace SRMBackend.IService
{
    public interface ICryptoManger
    {
        (string HashHex, string SaltHex) HashPassword(string password);
        bool VerifyPassword(string inputPassword, string storedHashHex, string storedSaltHex);
    }
}