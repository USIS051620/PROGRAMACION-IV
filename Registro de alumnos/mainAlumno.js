var db_alumno = openDatabase('dbAlumno', '1.0', 'Sistema de Registro', 5 * 1024 * 1024);
if(!db_alumno){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appAlumno',
    data: {
        alumnos: [],
        buscar: '',
        alumno: {
            accion: 'nuevo',
            msg : '',
            idAlumno: '',
            codigo: '',
            nombre: '',
            apellido: '',
            direccion: '',
            fnacimiento: "",
            telefono: '',
            email: ''
        },
    },
    methods: {
        buscarAlumno(){
            /*if( this.buscar.trim().length>0 ){
                this.alumnos = this.alumnos.filter(item=>item.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>=0);
            } else {
                 this.obtenerAlumnos();
            }*/
            this.obtenerAlumnos(this.buscar);
        },
        guardarAlumno(){
            let sql = '',
            parametros = [];
        if(this.alumno.accion == 'nuevo'){
            sql = 'INSERT INTO alumnos (codigo, nombre, apellido, fnacimiento, direccion, telefono, email) VALUES (?,?,?,?,?,?,?)';
            parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.apellido,this.alumno.fnacimiento,this.alumno.direccion,this.alumno.telefono,this.alumno.email];
        }else if(this.alumno.accion == 'modificar'){
            sql = 'UPDATE alumnos SET codigo=?, nombre=?, apellido=?, fnacimiento=?, direccion=?, telefono=?, email=? WHERE idAlumno=?';
            parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.apellido,this.alumno.fnacimiento,this.alumno.direccion,this.alumno.telefono,this.alumno.email,this.alumno.idAlumno];
        }else if(this.alumno.accion == 'eliminar'){
            sql = 'DELETE FROM alumnos WHERE idAlumno=?';
            parametros = [this.alumno.idAlumno];
        }
            db_alumno.transaction(tx=>{
                tx.executeSql(sql,
                    parametros,
                (tx, results)=>{
                    this.alumno.msg = 'Alumno guardado con exito';
                    this.nuevoAlumno();
                    this.obtenerAlumnos();
                },
                (tx, error)=>{
                    this.alumno.msg = `Error al guardar el Alumno ${error.message}`;
                });
            });
        },
        modificarAlumno(alumno){
            this.alumno = alumno;
            this.alumno.accion = 'modificar';
        },
        eliminarAlumno(alumno){
            if( confirm(`¿Esta seguro de eliminar el alumno ${alumno.nombre}?`) ){
                this.alumno.idAlumno = alumno.idAlumno;
                this.alumno.accion = 'eliminar';
                this.guardarAlumno();
            }
        },
        obtenerAlumnos(busqueda=''){
            db_alumno.transaction(tx=>{
                tx.executeSql(`SELECT * FROM alumnos WHERE nombre like "%${busqueda}%" OR codigo like "%${busqueda}%"`, [], (tx, results)=>{
                    this.alumnos = results.rows;
                    /*this.alumnos = [];
                    for(let i=0; i<results.rows.length; i++){
                        this.alumnos.push(results.rows.item(i));
                    }*/
                });
            });
        },
        nuevoAlumno(){
            this.alumno.accion = 'nuevo';
            this.alumno.idAlumno = '';
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.apellido = '';
            this.alumno.fnacimiento = '';
            this.alumno.direccion = '';
            this.alumno.telefono = '';
            this.alumno.email = '';
        }
    },
    created(){
        db_alumno.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS alumnos (idAlumno INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10), nombre char(75), apellido char(75), fnacimiento date, direccion TEXT, telefono char(10), email char(75))');
        }, err=>{
            console.log('Error al crear la tabla de alumnos', err);
        });
        this.obtenerAlumnos();
    }
});