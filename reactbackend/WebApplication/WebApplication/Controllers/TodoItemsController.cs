using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Dal;
using Microsoft.EntityFrameworkCore;
using WebApplication.Models;
using Microsoft.AspNetCore.Http;

namespace WebApplication.Controllers
{
    [Route("todoitems")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext dbContext;

        public TodoItemsController(TodoContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
        {
            return await dbContext.TodoItems.OrderBy(a => a.aktualishely).ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult<IEnumerable<TodoItem>>> PostTodo(TodoItem todo)
        {
            var tablalistaszam = dbContext.TodoItems.Where(t => t.tabla.Equals("todo"));
            int max = 0;
            if (tablalistaszam.Any())
            {
                max = tablalistaszam.Max(t => t.aktualishely);
            }
            todo.tabla = "todo";
            
            todo.aktualishely = max + 1;

            dbContext.TodoItems.Add(todo);
            await dbContext.SaveChangesAsync();
            var tablaista = await dbContext.TodoItems.Where(t => t.tabla.Equals("todo")).ToListAsync();

            return tablaista;
        }


        [HttpDelete("{id:int}")]
        public async Task<ActionResult<TodoItem>> DeleteTodo(long id)
        {

            TodoItem todos = dbContext.TodoItems.Where(a => a.Id == id).FirstOrDefault();
            string table = todos.tabla;
            if (todos == null)
            {
                return StatusCode(StatusCodes.Status200OK);
            }

            dbContext.TodoItems.Remove(todos);
            dbContext.SaveChanges();
            var rendezes = dbContext.TodoItems.Where(t => t.tabla == table).OrderBy(t => t.aktualishely).ToList();
            for (int i = 0; i < rendezes.Count(); i++)
            {
                rendezes[i].aktualishely = i + 1;
            }
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK);
        }

        [HttpPut("table")]
        public async Task<ActionResult<TodoItem>> PutTodoTabla([FromQuery] long id, [FromQuery] int ujhely, [FromQuery] string ujtabla)
        {
            TodoItem newtodo = dbContext.TodoItems.Where(a => a.Id == id).FirstOrDefault();

            string regitabla = newtodo.tabla;
            var regitablalista = dbContext.TodoItems.Where(t => t.tabla.Equals(regitabla) && t.Id != newtodo.Id).OrderBy(a=>a.aktualishely).ToList();

            for (int i = 0; i < regitablalista.Count(); i++)
            {
                regitablalista[i].aktualishely = i + 1;
            }

            newtodo.tabla = ujtabla;
            newtodo.aktualishely = ujhely;
            dbContext.SaveChanges();
            var aktualistablalista = dbContext.TodoItems.Where(t => t.tabla.Equals(newtodo.tabla) && t.aktualishely >= ujhely).OrderBy(a => a.aktualishely).ToList();

            /*
            aktualistablalista.Remove(newtodo);
            aktualistablalista.Insert(newtodo.aktualishely -1, newtodo);
            */

            int index = ujhely;

            for (int i = 0; i < aktualistablalista.Count(); i++)
            {
                if (aktualistablalista[i].Id == newtodo.Id)
                {
          
                    continue; 
                }
                aktualistablalista[i].aktualishely = ++index;
            }

            for (int i = 0; i < aktualistablalista.Count(); i++)
            {
                Console.WriteLine(aktualistablalista[i].title + "++++++++" + aktualistablalista[i].aktualishely);
            }
            await dbContext.SaveChangesAsync();
            return newtodo;  
        }

        [HttpPut]
        public async Task<ActionResult<TodoItem>> PutTodoPrioritas([FromQuery] long id, [FromQuery] int ujhely, [FromQuery] int regihely)
        {
       
            TodoItem newtodo = dbContext.TodoItems.Where(a => a.Id == id).FirstOrDefault();
  

            var tablalista = dbContext.TodoItems.Where(t => t.tabla.Equals(newtodo.tabla)).OrderBy(a => a.aktualishely).ToList();
            tablalista.RemoveAt(regihely);
            tablalista.Insert(ujhely, newtodo);
            for (int i = 0; i < tablalista.Count(); i++)
            {
                tablalista[i].aktualishely = i + 1;

            }

            await dbContext.SaveChangesAsync();

            return newtodo;
 
        }
    }
}
