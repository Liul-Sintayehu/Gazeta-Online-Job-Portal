namespace FSC.Application.Services.UnitOfWork
{ 
    public interface IUnitOfWork : IDisposable
    {      
        //IRepositoryBase<Employee> Employees { get; }
        //IRepositoryBase<OrgStructurePosition> OrgStructurePositions { get; }
        int Complete();
        void Commit();
        void Rollback();
        Task CommitAsync();
        Task RollbackAsync();
    }
}