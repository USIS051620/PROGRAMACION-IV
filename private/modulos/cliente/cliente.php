<?php
include('../../db/DB.php');

class cliente{
    private $datos=[], $db;
    public $respuesta = ['msg'=>'correcto'];

    public function cliente($db=''){
        $this->db = $db;
    }
    public function recibir_datos($cliente=''){
        $this->datos = json_decode($cliente, true);
        $this->validar_datos();
    }
    private function validar_datos(){
        if( empty(trim($this->datos['codigo'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el codigo';
        }
        if( empty(trim($this->datos['nombre'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el nombre';
        }
        if( empty(trim($this->datos['direccion'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese la direccion';
        }
        if( empty(trim($this->datos['telefono'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el telefono';
        }
        if( empty(trim($this->datos['dui'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el dui';
        }
    }
    private function almacenar_datos(){

    }
}
?>