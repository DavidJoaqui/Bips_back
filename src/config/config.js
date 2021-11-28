config = {
    port: 3000,
    rutaPaginas: "pages/",
    rutaPartials: "partials/",
    rutaViews: "src/views",
    rutaPublic: "src/public",
    rutaFile: "C:/Bips_back/filesBipsUploads",
    rutaSoportesCtm: "C:/Upload_Soportes_Bips",
    rutaSoportes_tmp_Ctm : "C:/tmp",
    rutaPublicPdfjs: "C:/Bips_back/pdf.js/web",
    //utaFile: "E:/Dato_BI/Bips_back/filesBipsUploads",
    //rutaSoportesCtm: "E:/Upload_Soportes_Bips",
    sesionSecret: "1d257a7cedc779675860fd92a7ca5baa3b14f7650bdff6612344a730d9a7082b8bfe5b63ab6b4c9aaa55aeb3acdd918a3d736cad21ac4c4e732d18afece369f20711205ee2485cb8ef819313000680c8",
    bd: {
        user: "postgres",
        host: "127.0.0.1",
        database: "bips_bd",
        //password: "bipsbd",
        password: "root",
        port: 5432,
    },
};

module.exports = config;