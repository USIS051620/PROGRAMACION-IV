<?php
//importar la conexion a la BD
include('../../private/db/config.php');

//Estraccion de datos desde el front-end
extract($_REQUEST);

$class_cliente = new cliente($conexion);
$cliente = isset($cliente) ? $cliente : '[]';
print_r($class_cliente->$accion($cliente));
class cliente{
    private $datos=[], $db;

    public $respuesta = ['msg'=>'correcto'];
    public function cliente($db=''){
        $this->db = $db;
    }
    public function recibir_datos($cliente=''){
        $this->datos = json_decode($cliente, true);
    }
    private function validar_datos(){
        if(empty(trim($this->datos['codigo'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el codigo';
        }
        if(empty(trim($this->datos['nombre'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el nombre';
        }
        return $this->almacenar_datos();
    }
    private function almacenar_datos(){
        if( $this->respuesta['msg']=='correcto' ){
            if( $this->datos['accion']=='nuevo' ){
                $this->db->consultas('INSERT INTO db_sistema_a2.clientes(codigo, nombre, direccion, telefono, dui) 
                    VALUES(:codigo, :nombre, :direccion, :telefono, :dui)', 
                    [':codigo'=>$this->datos['codigo'], ':nombre'=>$this->datos['nombre'], ':direccion'=>$this->datos['direccion'],
                    ':telefono'=>$this->datos['telefono'], ':dui'=>$this->datos['dui']]);
                    return $this->db->obtener_ultimo_id();
            }else if( $this->datos['accion']=='modificar' ){
                $this->db->consultas('UPDATE db_sistema_a2.clientes SET codigo=:codigo, nombre=:nombre, direccion=:direccion,
                    telefono=:telefono, dui=:dui WHERE idCliente=:idCliente', 
                    [':codigo'=>$this->datos['codigo'], ':nombre'=>$this->datos['nombre'], ':direccion'=>$this->datos['direccion'],
                    ':telefono'=>$this->datos['telefono'], ':dui'=>$this->datos['dui'], ':idCliente'=>$this->datos['idCliente']]);
                    return $this->db->obtener_respuesta();
            }else if( $this->datos['accion']=='eliminar' ){
                $this->db->consultas('DELETE FROM db_sistema_a2.clientes WHERE idCliente=:idCliente', 
                    [':idCliente'=>$this->datos['idCliente']]);
                    return $this->db->obtener_respuesta();
            }
        }else{
            return $this->respuesta['msg'];
        }
    }
}

?>