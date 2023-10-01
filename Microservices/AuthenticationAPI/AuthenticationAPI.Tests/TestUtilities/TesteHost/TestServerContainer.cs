using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace AuthenticationAPI.Tests.TestUtilities.TesteHost
{
    public class TestServerContainer : IDisposable
    {
        private bool disposedValue;

        public HttpClient HttpClient { get; set; }

        /// <summary>
        /// Cria um web host para execução dos testes da aplicação. Através desse web host, podemos fazer os testes em
        /// um web host controlado.
        /// </summary>
        /// <param name="additionIServiceConfiguration">Injeta serviços de acordo com a necessidade. Usado principalmente para injetar serviços fake.</param>
        public TestServerContainer(Action<IServiceCollection>? additionIServiceConfiguration = null)
        {
            var application = new WebApplicationFactory<Program>()
                .WithWebHostBuilder(builder => 
                {
                    builder.ConfigureServices(services =>
                    {
                        // [Adicionar os fakes necessários aqui]

                        if (additionIServiceConfiguration != null)
                            additionIServiceConfiguration.Invoke(services);
                    });
                });

            HttpClient = application.CreateClient();
        }

        // Implementa o Dispose para liberar os recursos do HttpCliente corretamente.
        // O Dispose serve para liberar recursos que não serão mais utilizados pelo sistema, tornado-o mais eficiente e evitando problemas
        // pelo mal gerencialmente de recursos.
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    HttpClient.Dispose();
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
