namespace FSC.Application.Models
{
    public class IdentityCreateUserDto
    {
        public string username { get; set; }
        public string email { get; set; } = string.Empty;
        public string firstName { get; set; }
        public string password { get; set; }
        public string lastName { get; set; }
        public bool isSuperAdmin { get; set; } = false;
        public bool isCompany { get; set; } = false;
        public bool isAccountLocked { get; set; } = false;
        public string phoneNumber { get; set; }
        public List<long> Roles { get; set; }
    }

    public class IdentitySubscriptionDto
    {
        public long userId { get; set; }
        public long clientId { get; set; }
        public long organizatoinId { get; set; }
        public bool isDefault { get; set; }
    }
    public class IdentityCreateResDto
    {
        public long Id { get; set; }
        public string email { get; set; } = string.Empty;
        public string firstName { get; set; }
    }
}
