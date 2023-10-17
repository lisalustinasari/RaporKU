const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb');

const couch = new NodeCouchDb({
	auth: {
		user: 'admin',
		password: '12345'
	}
});

const dbName = 'daftarsiswa';
const viewUrl = '_design/daftar_siswa/_view/siswa';
const viewUrl2 = '_design/daftar_siswa/_view/nilai';

couch.listDatabases().then(function(dbs){
    console.log(dbs);
});

const app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

//menampilkan gambar title
app.use('/logo-nih.png', express.static('/assets/images/logo-nih.png'));
//

//memanggil halaman 
app.get('/',function(req,res){
		res.render("index");
});
app.get("/profilguru", function (req, res) {
    res.render("profilguru");
});
app.get("/daftarkelas", function (req, res) {
    res.render("daftarkelas");
});
app.get("/tambahdatasiswa", function (req, res) {
    res.render("tambahdatasiswa");
});
app.get("/tambahnilai", function (req, res) {
    res.render("tambahnilai");
});
//

// Read Daftar Siswa
app.get("/daftarsiswa", function (req, res) {
	couch.get(dbName,viewUrl).then(
		function(data,headers,status){
			console.log(data.data.rows);
			res.render('daftarsiswa',{
			daftarsiswa:data.data.rows
			});
		},
		function(err){
			res.send(err);
		});
});
//

//Read Nilai Siswa
app.get("/tabelnilaisiswa", function (req, res) {
	couch.get(dbName,viewUrl2).then(
		function(data,headers,status){
			console.log(data.data.rows);
			res.render('tabelnilaisiswa',{
			daftarsiswa:data.data.rows
			});
		},
		function(err){
			res.send(err);
		});
});
//

// Create Daftar Siswa dan Nilai Siswa
app.post('/daftarsiswa/add', function(req,res){
//variabel baru:name form
	const nis = req.body.nis;
	const name = req.body.name;
	const ttl = req.body.ttl;
	const email = req.body.email;
	const notlp = req.body.notlp;
	const alamat = req.body.alamat;
	const namaayah = req.body.namaayah;
	const notlp_ayah= req.body.notlpayah;
	const namaibu = req.body.namaibu;
	const notlp_ibu = req.body.notlpibu;
	const uas_ipa = req.body.uasipa;
	const un_ipa = req.body.unipa;
	const uh_ipa = req.body.uhipa;
	const uas_mtk = req.body.uasmtk;
	const un_mtk = req.body.unmtk;
	const uh_mtk = req.body.uhmtk;
	const uas_bindo = req.body.uasbindo;
	const un_bindo = req.body.unbindo;
	const uh_bindo = req.body.uhbindo;
	const uas_bing = req.body.uasbing;
	const un_bing = req.body.unbing;
	const uh_bing = req.body.uhbing;
	
	couch.uniqid().then(function(ids){
		const id = ids[0];
		
		couch.insert('daftarsiswa',{
//kolom database:variabel baru
			_id: id,
			nis: nis,
			namalengkap: name,
			ttl: ttl,
			email: email,
			notlp: notlp,
			alamat: alamat,
			namaayah: namaayah,
			notlpayah: notlp_ayah,
			namaibu: namaibu,
			notlpibu: notlp_ibu,
			uasipa: uas_ipa,
			unipa: un_ipa,
			uhipa: uh_ipa,
			uasmtk: uas_mtk,
			unmtk: un_mtk,
			uhmtk: uh_mtk,
			uasbindo:uas_bindo,
			unbindo:un_bindo,
			uhbindo:uh_bindo,
			uasbing:uas_bing,
			unbing:un_bing,
			uhbing:uh_bing
			
			
		}).then(
		function(data,headers,status){
			res.redirect('/daftarsiswa');
		},
		function(err){
			res.send(err);
		});
	});
});
//

//Delete Daftar Siswa
app.post('/daftarsiswa/delete/:id',function(req, res){
	const id = req.params.id;
	const rev = req.body.rev;
	
	couch.del(dbName, id, rev).then(
	function(data,headers,status){
		res.redirect('/daftarsiswa');
	},
	function(err){
		res.send(err);
	});
});
//

//menjalankan port localhost
app.listen(3000,function(){
	console.log('server started on port 3000');
});
//