var idUnicoFecha = ()=>{
    let fecha = new Date();
    return Math.floor(fecha.getTime()/100).toString(16);
};
var app = new Vue({
    el: '#appCliente',
    data: {
        clientes: [],
        buscar: '',
        cliente: {
            accion: 'nuevo',
            msg : '',
            idCliente: '',
            codigo: '',
            nombre: '',
            direccion: '',
            telefono: '',
            dui: ''
        },
    },
    methods: {
        buscarCliente(){

            this.obtenerClientes(this.buscar);
        },
        guardarCliente(){

            if(this.cliente.accion == 'nuevo'){  
                this.cliente.idCliente = idUnicoFecha();


        }
        localStorage.setItem(this.cliente.idCliente, JSON.stringify(this.cliente));
        this.cliente.msg = 'Cliente procesado con exito';
        this.nuevoCliente();
        this.obtenerClientes();
        },
        modificarCliente(data){
            this.cliente = data;
            this.cliente.accion = 'modificar';
        },
        eliminarCliente(data){
            if( confirm(`¿Esta seguro de eliminar el cliente ${data.nombre}?`) ){
                this.cliente.idCliente = data.idCliente;
                this.cliente.accion = 'eliminar';
                this.guardarCliente();
                localStorage.removeItem(cliente.idCliente);
                this.obtenerClientes();
            }
            this.nuevoCliente();
        },
        obtenerClientes(valor=''){
            this.clientes = [];
                    for(let i=0; i<localStorage.length; i++){
                        let key = localStorage.key(i);
                        if( valor.trim().length>0 ){
                            let cliente = JSON.parse(localStorage.getItem(key));
                            if( cliente.nombre.toLowerCase().indexOf(valor.toLowerCase()) > -1 ){
                                this.clientes.push(cliente);

            /*this.clientes = [];
            for(let i=0; i<results.rows.length; i++){
                 this.clientes.push(results.rows.item(i));
           }*/
        } 
          }else {
            this.clientes.push(JSON.parse(localStorage.getItem(key)));
        }
        }

        },
        nuevoCliente(){
            this.cliente.accion = 'nuevo';
            this.cliente.idCliente = '';
            this.cliente.codigo = '';
            this.cliente.nombre = '';
            this.cliente.direccion = '';
            this.cliente.telefono = '';
            this.cliente.dui = '';
            this.cliente.msg = '';
            console.log(this.cliente);
            
        }
    },
    created(){
        this.obtenerClientes();
    }
});