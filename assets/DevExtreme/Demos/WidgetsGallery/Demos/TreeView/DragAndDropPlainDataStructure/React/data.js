const itemsDriveD = [];
const itemsDriveC = [{
  id: '1',
  name: 'Documents',
  isDirectory: true,
}, {
  id: '2',
  parentId: '1',
  name: 'Projects',
  isDirectory: true
}, {
  id: '3',
  parentId: '2',
  name: 'About.rtf',
  isDirectory: false
}, {
  id: '4',
  parentId: '2',
  name: 'Passwords.rtf',
  isDirectory: false
}, {
  id: '5',
  parentId: '2',
  name: 'About.xml',
  isDirectory: false
}, {
  id: '6',
  parentId: '2',
  name: 'Managers.rtf',
  isDirectory: false
}, {
  id: '7',
  parentId: '2',
  name: 'ToDo.txt',
  isDirectory: false
}, {
  id: '8',
  name: 'Images',
  isDirectory: true,
}, {
  id: '9',
  parentId: '8',
  name: 'logo.png',
  isDirectory: false
}, {
  id: '10',
  parentId: '8',
  name: 'banner.gif',
  isDirectory: false
}, {
  id: '11',
  name: 'System',
  isDirectory: true,
}, {
  id: '12',
  parentId: '11',
  name: 'Employees.txt',
  isDirectory: false
}, {
  id: '13',
  parentId: '11',
  name: 'PasswordList.txt',
  isDirectory: false,
}, {
  id: '14',
  name: 'Description.rtf',
  isDirectory: false
}, {
  id: '15',
  name: 'Description.txt',
  isDirectory: false
}];

export default {
  getItemsDriveC() {
    return itemsDriveC;
  },
  getItemsDriveD() {
    return itemsDriveD;
  }
};
