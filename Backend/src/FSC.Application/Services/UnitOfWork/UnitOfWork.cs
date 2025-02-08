namespace FSC.Application.Services.UnitOfWork
{
    public class UnitOfWork(ApplicationDbContext dbContext) : IUnitOfWork
    {
        //public IRepositoryBase<Employee> Employees { get; }
        //public IRepositoryBase<OrgStructurePosition> OrgStructurePositions { get; }

        //public UnitOfWork(ApplicationDbContext dbContext, IRepositoryBase<Employee> employeeRepository, IRepositoryBase<OrgStructurePosition> orgStructurePositions)
        //{
        //    this._dbContext = dbContext;

        //    this.Employees = employeeRepository;
        //    OrgStructurePositions = orgStructurePositions;
        //}

        public int Complete()
        {
            return dbContext.SaveChanges();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                dbContext.Dispose();
            }

        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        public void Commit()
           => dbContext.SaveChanges();


        public async Task CommitAsync()
            => await dbContext.SaveChangesAsync();

        public void Rollback()
            => dbContext.Dispose();

        public async Task RollbackAsync()
            => await dbContext.DisposeAsync();

    }
}