<?php

    require_once __DIR__.'/../../../third_party/autoload.php';
    
    use chriskacerguis\RestServer\RestController;

    class Api_master extends RestController {

        function __construct()
        {
            // Construct the parent class
            parent::__construct();
        }

        public function users_get()
        {
            // Users from a data store e.g. database
            $users = [
                ['id' => 0, 'name' => 'John', 'email' => 'john@example.com'],
                ['id' => 1, 'name' => 'Jim', 'email' => 'jim@example.com'],
                ['id' => 2, 'name' => 'Jimss', 'email' => 'jim@example.comsss'],
            ];

            $id = $this->get( 'id' );

            if ( $id === null )
            {
                // Check if the users data store contains users
                if ( $users )
                {
                    // Set the response and exit
                    $this->response( $users, 200 );
                }
                else
                {
                    // Set the response and exit
                    $this->response( [
                        'status' => false,
                        'message' => 'No users were found'
                    ], 404 );
                }
            }
            else
            {
                if ( array_key_exists( $id, $users ) )
                {
                    $this->response( $users[$id], 200 );
                }
                else
                {
                    $this->response( [
                        'status' => false,
                        'message' => 'No such user found'
                    ], 404 );
                }
            }
        }
    
        function user_get(){
            $user = [
                ['id' => 0, 'name' => 'John', 'email' => 'john@example.com'],
                ['id' => 1, 'name' => 'Jim', 'email' => 'jim@example.com'],
                ['id' => 2, 'name' => 'Jimss', 'email' => 'jim@example.comsss'],
            ];

            // respond with information about a user
            if(!$this->get('id')){
                $this->response( [
                        'status' => false,
                        'message' => 'No users were found'
                    ], 404 );
            }
            if ( array_key_exists( $this->get( 'id' ), $user ) ) {
                $this->response( $user[$this->get( 'id' )], 200 );
            } 
            else{
                $this->response( [
                    'status' => false,
                    'message' => 'No such user found'
                ], 404 );
            }
        }
    
        function user_post(){
            // create user
            $data = array(
                'user' => $this->post('user'),
                'active' => $this->post('active'),
                'date_c' => date("Y-m-d h:i:s")
            );

            $this->response($data);

            // $result = $this->tm->create( $data);
            // if($result === FALSE){
            //     $this->response(array('status' => 'failed'));
            // }else{
            //     $this->response(array('status' => 'success'));
            // }

        }
    
        function user_put(){
            // update user
            $rs = array();
            $id = $this->get('id');
            $data = array(
                'user' => $this->put('user'),
                'active' => $this->put('active'),
                'date_u' => date("Y-m-d h:i:s")
            ); 
            array_push($rs,array('status' => 'success'));
            array_push($rs,$data);
            array_push($rs,$id);

            $this->response($rs);
            //$result = $this->tm->update($id, $data);
            // if($result === FALSE){
            //     $this->response(array('status' => 'failed'));
            // }else{
            //     $this->response(array('status' => 'success'));
            // }
        }
    
        function user_delete(){
            //delete a user and respond with a status/errors

            $id = $this->get('id');
            $this->response(array('status' => 'success '.$id));

            // $result = $this->tm->delete($this->get('id'));
            // if($result === FALSE){
            //     $this->response(array('status' => 'failed'));
            // }else{
            //     $this->response(array('status' => 'success'));
            // }
        }

    }