<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Component extends MY_Controller {

	public function index()
	{
		$this->template('component_view');
	}
}
