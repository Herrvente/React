using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication.Models;

namespace WebApplication.Dal
{
    public class TodoContext : DbContext

    {
        public DbSet<TodoItem>TodoItems { get; set; }
        
        public TodoContext(DbContextOptions options) : base(options)
        {
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
                throw new System.Exception("DbContext not configured");

            base.OnConfiguring(optionsBuilder);
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TodoItem>()
                .HasKey(todo => todo.Id);
            modelBuilder.Entity<TodoItem>()
                .Property(todo => todo.Id).ValueGeneratedOnAdd();

            modelBuilder.Entity<TodoItem>(entity =>
            {


                entity.HasData(
                    new TodoItem(2, "ElsoItem", "asdf", new DateTime(2112, 12, 11), "todo")

       
                   ); ;

            });

            base.OnModelCreating(modelBuilder);

        }
    }

}
