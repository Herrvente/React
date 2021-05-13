using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication.Models
{
    public class TodoItem : IEquatable<TodoItem>

    {
        public TodoItem(long id, string title, string body, DateTime date, string tabla)
        {
            this.title = title;
            this.body = body;
            this.date = date;
            Id = id;
            this.tabla = tabla;
        }

        public TodoItem()
        {
        }

        public string title { get; set; }
        public string body { get; set; }
        public DateTime date { get; set; }
        public long Id { get; set; }
        public string tabla { get; set; }
        public int aktualishely { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as TodoItem);
        }
        public bool Equals(TodoItem other)
        {
            return other != null &&
                   Id == other.Id &&
                   body == other.body &&
                   title == other.title &&
                   date == other.date &&
                   tabla == other.tabla;
                   
        }
        public override int GetHashCode()
        {
            return HashCode.Combine(Id, title, body, date, tabla);
        }
    }
    
}
