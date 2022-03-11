Vue.component('cliente', {
    data:()=>{
        return {
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
            }
        }
    },
    methods: {
        buscarCliente(){
            this.obtenerDatos(this.buscar);
        },
        guardarCliente(){
            let store = abrirStore('clientes','readwrite');
            if( this.cliente.accion == 'nuevo' ){
                this.cliente.idCliente = idUnicoFecha();
            }
            let query = store.put(this.cliente);
            query.onsuccess=e=>{
                fetch(`modulos/cliente/cliente.php?cliente=${JSON.stringify(this.cliente)}&
                    accion=recibir_datos`,
                    {credentials:'same-origin'})
                    .then(res=>res.json())
                    .then(data=>{
                        this.cliente.msg = 'Cliente sincronizado con exito en el servidor'
                    })
                    .catch(err=>{
                        this.cliente.msg = `Error al sincronizar el cliente en el servidor: ${err}`
                    });
                this.cliente.msg = 'Cliente procesado con exito';
                this.nuevoCliente();
                this.obtenerDatos();
            };
            query.onerror=e=>{
                this.cliente.msg = 'Error al procesar el cliente';
            };
        },
        modificarCliente(data){
            this.cliente = JSON.parse(JSON.stringify(data));
            this.cliente.accion = 'modificar';
        },
        eliminarCliente(data){
            if( confirm(`¿Esta seguro de eliminar el cliente ${data.nombre}?`) ){
                let store = abrirStore('clientes','readwrite'),
                    query = store.delete(data.idCliente);
                query.onsuccess=e=>{
                    this.cliente.msg = 'Cliente eliminado con exito';
                    this.nuevoCliente();
                    this.obtenerDatos();
                };
                query.onerror=e=>{
                    this.cliente.msg = `Error al procesar el cliente ${e.target.error}`;
                };
            }
        },
        obtenerDatos(busqueda=''){
            let store = abrirStore('clientes', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.clientes = data.result.filter(cliente=>cliente.nombre.toLowerCase().indexOf(busqueda.toLowerCase())>-1);
            };
            data.onerror = e=>{
                this.cliente.msg = `Error al obtener los datos ${e.target.error}`;
            };
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
        }
    }, 
    created(){
        //this.obtenerDatos();
    },
    template: `
        <div id='appCliente'>
            <form @submit.prevent="guardarCliente" @reset.prevent="nuevoCliente" method="post" id="frmCliente">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de Clientes
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmCliente" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                        <div class="row p-1">
                            <div class="col col-md-1">Codigo</div>
                            <div class="col col-md-2">
                                <input v-model="cliente.codigo" placeholder="codigo" pattern="[A-Z0-9]{3,10}" required title="Codigo de cliente" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">Nombre</div>
                            <div class="col col-md-2">
                                <input v-model="cliente.nombre" placeholder="escribe tu nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de cliente" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">Direccion</div>
                            <div class="col col-md-2">
                                <input v-model="cliente.direccion" placeholder="donde vives" pattern="[A-Za-z0-9Ññáéíóú ]{3,100}" required title="Direccion de cliente" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">Telefono</div>
                            <div class="col col-md-2">
                                <input v-model="cliente.telefono" placeholder="tu tel" pattern="[0-9]{4}-[0-9]{4}" required title="Telefono de cliente" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">DUI</div>
                            <div class="col col-md-2">
                                <input v-model="cliente.dui" placeholder="tu DUI" pattern="[0-9]{8}-[0-9]{1}" required title="DUI de cliente" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                    {{ cliente.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <button type="submit" class="btn btn-primary">Guardar</button>
                                <button type="reset" class="btn btn-warning">Nuevo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="card mb-3" id="cardBuscarCliente">
                <div class="card-header text-white bg-dark">
                    Busqueda de Clientes
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarCliente" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <td colspan="6">
                                    Buscar: <input title="Introduzca el texto a buscar" @keyup="buscarCliente" v-model="buscar" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Direccion</th>
                                <th>Telefono</th>
                                <th>DUI</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in clientes" :key="item.idCliente" @click="modificarCliente(item)">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.direccion}}</td>
                                <td>{{item.telefono}}</td>
                                <td>{{item.dui}}</td>
                                <td>
                                    <button type="button" class="btn btn-danger" @click="eliminarCliente(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    `
});