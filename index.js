
// Morgan to CRUD Clubs
// Dave to CRUD Users


class Club {
    constructor(name){
        this.name = name;
        this.users = [];
    }

}

class Member {
    constructor(userName, id) {
        this.userName = userName;
        this.id = id;
    }
}

class ClubCrud {
    static url = 'https://crudcrud.com/api/4c2c67f89d6d42c990b1c2336d954cee' + '/clubs';

    static getAllClubs() {
        return $.get(this.url);
    }

    static getClub(id) {
        return $.get(this.url + `/${id}`);
    }
    
    // crudcrud requires json data and content type and stringified data
    static createClub(club) {
        return $.post({
            url: this.url,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(club),
        });
    }
    
    //crudcrud fails when passing id to API in PUT request
    static updateClub(club){
        let putData = JSON.stringify({name: club.name, users: club.users});
        return $.ajax ({
            url: this.url + `/${club._id}`,
            dataType: 'json',
            data: putData,
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

    static addMember(id) {
        for(let club of this.clubs) {
            if(club._id == id) {
                club.users.push(new Member($(`#${club._id}-username`).val(), club.users.length));

                ClubCrud.updateClub(club)
                .then(() => {
                    return ClubCrud.getAllClubs();
                })
                .then((clubs) => this.render(clubs));
            }
        }
    }

    static deleteMember(clubId, memberId) {
        for(let club of this.clubs) {
            if(club._id == clubId) {
                for(let user of club.users) {
                    if(user.id == memberId) {
                        club.users.splice(club.users.indexOf(user), 1);
                        ClubCrud.updateClub(club)
                        .then(() => {
                            return ClubCrud.getAllClubs();
                        })
                        .then((clubs) => this.render(clubs));
                    }
                }
            }
        }
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
                                    <button id="${club._id}-add-member" class="btn btn-warning" onclick="DOMManager.addMember('${club._id}')">Add Member</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            );
            let users = club.users;
            for(let i = 0; i < users.length; i++) {
                $(`#${club._id}`).find('.card-body').append(
                    `<div class="row">
                        <div class="col-sm">${users[i].userName}</div>
                        <div class="col-sm">
                            <button id="user${i}" class="btn btn-warning" onclick="DOMManager.deleteMember(${club._id}, ${i})">Delete Member</button>
                        </div>
                    </div>
                    `
                )
            }
        }
    }
}

$('#create-new-club').click(() => {
    DOMManager.createClub($('#new-club-name').val());
    $('#new-club-name').val('');
});

DOMManager.getAllClubs();



