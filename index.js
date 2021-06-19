
// Morgan to CRUD Clubs
// Dave to CRUD Users


class Club {
    constructor(name){
        this.name = name;
        this.users = [];
    }

}

class ClubCrud {
    static url = 'https://891e8726-623d-4833-96a3-8ec50f9fdac5.mock.pstmn.io//v1/home';

    static getAllClubs() {
        return $.get(this.url);
    }

    static getClub(id) {
        return $.get(this.url + `/${id}`);
    }

    static createClub(club) {
        return $.post(this.url, club);
    }

    static updateClub(club){
        return $.ajax ({
            url: this.url + `/${club._id}`,
            dataType: 'json',
            data: JSON.stringify(club),
            contentType: 'application/json',
            type:'PUT',
        });
    }

    static deleteClub(id) {
        return $.ajax ({
            url: this.url + `/${id}`,
            type: 'DELETE',
        });
    }
}

class DOMManager {
    static clubs;

    static getAllClubs(){
        ClubCrud.getAllClubs().then(clubs => this.render(clubs));
    }

    static createClub(name) {
        ClubCrud.createClub(new Club(name))
            .then(() => {
                return ClubCrud.getAllClubs();
            })
            .then((clubs) => this.render(clubs));
    }

    static deleteClub(id){
        ClubCrud.deleteClub(id)
            .then(() => {
                return ClubCrud.getAllClubs();
            })
            .then((clubs) => this.render(clubs));
    }

    static render(clubs){
        this.clubs = clubs;
        $('#app').empty();
        for(let club of clubs) {
            $('#app').prepend (
                `<div id="${club._id}" class="card">
                    <div class="card-header">
                        <h2>${club.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteClub('${club._id}')">Delete Club</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${club._id}-user-name" class="form-control" placeholder="Member Name">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            )
        }
    }
}

$('#create-new-club').click(() => {
    DOMManager.createClub($('#new-club-name').val());
    $('#new-club-name').val('');
});

DOMManager.getAllClubs();



