  document.addEventListener('DOMContentLoaded', function() {
    realtimeClock();
    modal();

    const mhs = document.querySelector('#mhs')
    const url = `http://localhost:3000/mahasiswa`
    const formSubmit = document.querySelector('#formSubmit')
    let nodata = document.querySelector('#nodata')
    let allData = []

    fetch(`${url}`)
      .then( response => response.json() )
      .then( mhsData => mhsData.forEach(function(data) {
        allData = mhsData
        nodata.innerHTML = ` `
        mhs.innerHTML += `
        <tr id="data-${data.id}" class="table">
          <td data-label="NIM">000000${data.nim}</td>
          <td data-label="NAMA">${data.nama}</td>
          <td data-label="ALAMAT">${data.alamat}</td>
          <td style="text-align: center;">
            <button class="editBtn" data-id=${data.id} id="edit-${data.id}" data-action="edit">✎&nbsp;&nbsp;Edit</button>
            <button class="deleteBtn" data-id=${data.id} id="delete-${data.id}" data-action="delete">ⓧ&nbsp;&nbsp;Delete</button>
          </td>
        </tr>
        
        <div style="margin: 12px;">
          <div id=edit-data-${data.id}></div>
        </div>`
      }))


    //tambah
    formSubmit.addEventListener('submit', (e) => {
      e.preventDefault();

      const nimInput = formSubmit.querySelector('#NIM').value
      const nameInput = formSubmit.querySelector('#Nama').value
      const addresstInput = formSubmit.querySelector('#Alamat').value
      
      if(nimInput !== '' && nameInput !== '' && addresstInput !== ''){
        fetch(`${url}`, {
          method: 'POST',
          body: JSON.stringify({
            nim: nimInput,
            nama: nameInput,
            alamat: addresstInput
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then( response => response.json())
          .then( data => {
            allData.push(data)
            mhs.innerHTML += `
            <tr id="data-${data.id}">
              <td data-label="NIM">000000${data.nim}</td>
              <td data-label="NAMA">${data.nama}</td>
              <td data-label="ALAMAT">${data.alamat}</td>
              <td style="text-align: center;">
                <button class="editBtn" data-id=${data.id} id="edit-${data.id}" data-action="edit">✎&nbsp;&nbsp;Edit</button>
                <button class="deleteBtn" data-id=${data.id} id="delete-${data.id}" data-action="delete">ⓧ&nbsp;&nbsp;Delete</button>
              </td>  
            </tr>

            <div>
              <div id=edit-data-${data.id}></div>
            </div>`
            alert('Berhasil Menambahkan Data!!')
          })
      }
      else{
        alert('Semua Kolom Harus Diisi!!')
      }
    })


    //edit
    mhs.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'edit') {

        const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
        editButton.disabled = true

        const mhsData = allData.find((data) => {
          return data.id == e.target.dataset.id
        })
        
        const editForm = mhs.querySelector(`#edit-data-${e.target.dataset.id}`)
        editForm.innerHTML = `
          <div class="editform">
            <form id='edit-data' action='index.html' method='post'>
                <input id="edit-NIM" style="background-color: #E3E9EA;" value="${mhsData.nim}" readonly>
                <input required id="edit-Nama" value="${mhsData.nama}">
                <input required id="edit-Alamat" value="${mhsData.alamat}">
                <input style="padding: 5px 10px;border-radius: 8px; border: 1px solid #ACFF15; background-color: #DAF7A6; cursor: pointer;" type="submit" value="&#x1f4be;&nbsp;Save">
            </form>
          </div>`

          editForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const nimInput = document.querySelector('#edit-NIM').value
            const nameInput = document.querySelector('#edit-Nama').value
            const addresstInput = document.querySelector('#edit-Alamat').value
            const editedData = document.querySelector(`#data-${mhsData.id}`)

            fetch(`${url}/${mhsData.id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                nim: nimInput,
                nama: nameInput,
                alamat: addresstInput
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then( response => response.json() )
              .then( data => {
                editedData.innerHTML = `
                <tr id="data-${data.id}">
                  <td data-label="NIM">000000${data.nim}</td>
                  <td data-label="NAMA">${data.nama}</td>
                  <td data-label="ALAMAT">${data.alamat}</td>
                  <td style="text-align: center;">
                    <button class="editBtn" data-id=${data.id} id="edit-${data.id}" data-action="edit">✎&nbsp;&nbsp;Edit</button>
                    <button class="deleteBtn" data-id=${data.id} id="delete-${data.id}" data-action="delete">ⓧ&nbsp;&nbsp;Delete</button>
                  </td>
                </tr>

                <div>
                  <div id=edit-data-${data.id}></div>
                </div>`
                alert('Data Berhasil Diedit!!')
              })
        })
      } 

      //delete
      else if (e.target.dataset.action === 'delete') {
        let confirmdlt = confirm("ANDA YAKIN INGIN MENGHAPUS DATA??");
        if (confirmdlt == true){
          document.querySelector(`#data-${e.target.dataset.id}`).remove()
            fetch(`${url}/${e.target.dataset.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(response => response.json())
            alert('Data Berhasil Dihapus!!!!')
        }
        else{
          return false;
        }
      }
    })
  })



  function modal(){
    var modal = document.getElementById("formModal");
    var btn = document.getElementById("addBtn");
    var close = document.getElementsByClassName("close")[0];
  
    btn.onclick = function(){
      modal.style.display = "block";
      document.querySelector("body").style.overflow = 'hidden';
    }
    close.onclick = function(){
      modal.style.display = "none";
      document.querySelector("body").style.overflow = 'visible';
    }
    window.onclick = function(event){
      if(event.target == modal){
        modal.style.display = "none";
        document.querySelector("body").style.overflow = 'visible';
      }
    }
  }



  function realtimeClock(){
    let rtClock = new Date();

    let hours = rtClock.getHours();
    let minutes = rtClock.getMinutes();
    let seconds = rtClock.getSeconds();

    let amPm = (hours < 12) ? "AM" : "PM";

    hours = (hours > 12) ? hours-12 : hours;

    hours = ("0" +hours).slice(-2);
    minutes = ("0" +minutes).slice(-2);
    seconds = ("0" +seconds).slice(-2);

    document.getElementById('clock').innerHTML =
        hours+ ":" +minutes+ ":" +seconds+ " " +amPm;
    let t = setTimeout(realtimeClock, 500);
  }