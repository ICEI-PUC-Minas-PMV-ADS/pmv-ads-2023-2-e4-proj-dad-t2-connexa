using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationAPI.Models;

public partial class ConnexaContext : DbContext
{
    public ConnexaContext()
    {
    }

    public ConnexaContext(DbContextOptions<ConnexaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Convite> Convites { get; set; }

    public virtual DbSet<ItemList> ItemLista { get; set; }

    public virtual DbSet<Lista> Lista { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserLista> UserLista { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=mysql-ag-br1-11.conteige.cloud;database=zlbspi_connexa;user=zlbspi_connexa;password=nDvZ$T!ItYDYPEC4", Microsoft.EntityFrameworkCore.ServerVersion.Parse("5.7.42-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("latin1_swedish_ci")
            .HasCharSet("latin1");

        modelBuilder.Entity<Convite>(entity =>
        {
            entity.HasKey(e => e.ConviteId).HasName("PRIMARY");

            entity.ToTable("convite");

            entity.HasIndex(e => e.ListaId, "lista_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.ConviteId)
                .HasColumnType("int(11)")
                .HasColumnName("convite_id");
            entity.Property(e => e.DataExpiracao).HasColumnName("data_expiracao");
            entity.Property(e => e.ListaId)
                .HasColumnType("int(11)")
                .HasColumnName("lista_id");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.Lista).WithMany(p => p.Convites)
                .HasForeignKey(d => d.ListaId)
                .HasConstraintName("convite_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Convites)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("convite_ibfk_1");
        });

        modelBuilder.Entity<ItemList>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PRIMARY");

            entity.ToTable("item_lista");

            entity.HasIndex(e => e.ListaId, "lista_id");

            entity.Property(e => e.ItemId)
                .HasColumnType("int(11)")
                .HasColumnName("item_id");
            entity.Property(e => e.ItemDescricao)
                .HasColumnType("text")
                .HasColumnName("item_descricao");
            entity.Property(e => e.ItemNome)
                .HasMaxLength(255)
                .HasColumnName("item_nome");
            entity.Property(e => e.ItemStatus).HasColumnName("item_status");
            entity.Property(e => e.ListaId)
                .HasColumnType("int(11)")
                .HasColumnName("lista_id");

            entity.HasOne(d => d.Lista).WithMany(p => p.ItemLista)
                .HasForeignKey(d => d.ListaId)
                .HasConstraintName("item_lista_ibfk_1");
        });

        modelBuilder.Entity<Lista>(entity =>
        {
            entity.HasKey(e => e.ListaId).HasName("PRIMARY");

            entity.ToTable("lista");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.ListaId)
                .HasColumnType("int(11)")
                .HasColumnName("lista_id");
            entity.Property(e => e.ListaDescricao)
                .HasColumnType("text")
                .HasColumnName("lista_descricao");
            entity.Property(e => e.ListaPublica).HasColumnName("lista_publica");
            entity.Property(e => e.ListaStatus).HasColumnName("lista_status");
            entity.Property(e => e.ListaTitulo)
                .HasColumnType("text")
                .HasColumnName("lista_titulo");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Lista)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("lista_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");
            entity.Property(e => e.PswhHash)
                .HasMaxLength(255)
                .HasColumnName("pswh_hash");
            entity.Property(e => e.UserEmail)
                .HasMaxLength(255)
                .HasColumnName("user_email");
            entity.Property(e => e.UserName)
                .HasMaxLength(255)
                .HasColumnName("user_name");
            entity.Property(e => e.UserStatus).HasColumnName("user_status");
        });

        modelBuilder.Entity<UserLista>(entity =>
        {
            entity.HasKey(e => e.UserListaId).HasName("PRIMARY");

            entity.ToTable("user_lista");

            entity.HasIndex(e => e.ListaId, "lista_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.UserListaId)
                .HasColumnType("int(11)")
                .HasColumnName("user_lista_id");
            entity.Property(e => e.ListaId)
                .HasColumnType("int(11)")
                .HasColumnName("lista_id");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("user_id");
            entity.Property(e => e.UserListaRole)
                .HasColumnType("int(11)")
                .HasColumnName("user_lista_role");
            entity.Property(e => e.UserListaStatus).HasColumnName("user_lista_status");

            entity.HasOne(d => d.Lista).WithMany(p => p.UserLista)
                .HasForeignKey(d => d.ListaId)
                .HasConstraintName("user_lista_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.UserLista)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("user_lista_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    public void ThrowException(string message)
    {
        Console.WriteLine(DateTime.Now + "Ouve uma exceção dentro do micro serviço de Autenticação:");
        Console.WriteLine(DateTime.Now + ": " + message);
    }
}
