
<?php
/**
 * /application/core/MY_Controller.php
 *
 */
class MY_Controller extends CI_Controller {

    public function template($template_name, $vars = array()) {
        $this->load->view('templates/header_view',$vars);
        $this->load->view('templates/sidebar_view',$vars);
        $this->load->view('templates/navbar_view',$vars);
        $this->load->view($template_name, $vars);
        $this->load->view('templates/footer_view',$vars);
    }
}
