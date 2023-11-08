export interface ListDTO {
    listaId: number;
    userId: number | null;
    listaPublica: boolean;
    listaStatus: boolean;
    listaDescricao: string | null;
    listaTitulo: string | null;
    idUserTarget: number;
    isOwner: boolean;
}