var server;
function load() {
    db_open()
    $("#topic_add").find("#topic_add_canclebtn").click(function () {
        $("#topic_add").find("#topic_add_textbox").val("");
        $("#settings").panel("close");
    });
    $("#topic_add").find("#topic_add_addbtn").click(function () {
        topics_add();
        $("#topic_add").find("#topic_add_textbox").val("");
        $("#settings").panel("close");
    });
    $("#addbtn").click(function () {        
        var dialog = $("#adddialog");
        dialog.find("#textarea_question").val("");
        dialog.find("#textarea_answer").val("");
       
    });
    $("#adddialog").find("#adddialog_add").click(function () {
        cards_add();
        $("#adddialog").dialog("close");
    });
    $("#cardview").find("#cardview_show_btn").mouseup(function () {
        $("#cardview").find("#cardview_answer").toggle();
    });
    $("#topic_remove").find("#topic_remove_btn").click(function () {
        $('#popup_conferm').popup('open', { positionTo: "window" });
    });
    $("#popup_conferm").find("#popup_yes").click(function () {
        topic_remove();
        $('#popup_conferm').popup('close')
        $("#settings").panel("close");
    });
    $("#popup_conferm").find("#popup_no").click(function () {
        $('#popup_conferm').popup('close')
        $("#settings").panel("close");
    });
    $("#settings").on("panelbeforeclose", function (event, ui) {
        $("#topic_add").trigger("collapse");
        $("#topic_remove").trigger("collapse");
        });
    
}
function db_open() {
    db.open({
        server: 'flash_card',
        version: 2,
        schema: {
            Cards: {
                key: { keyPath: 'id', autoIncrement: true },
                indexes: {
                    topic: {},
                    question: {},
                    answer: {},
                }
            },
            Topics: {
                key: { keyPath: 'id', autoIncrement: true },
                indexes: {
                    topic: {}
                }
            }
        }

    }).done(function (s) {
        server = s;
        topics_load();
    });
};
function topics_load() {
    server.Topics.query().all().execute()
        .done(function (results) {            
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                var int
                topics_ui_add(item);                
                cards_load(item.id.toString());
                $("#adddialog").find("#select_topic").append(new Option(item.topic, item.id));
                $("#topic_remove").find("#topic_remove_select").append(new Option(item.topic, item.id)).selectmenu('refresh');;
            };
        });
}
function topics_ui_add(item) {
    var html = $('<div data-role="collapsible"><h2></h2><ul data-role="listview" data-theme="c" data-divider-theme="b" data-filter="true" data-count-theme="c" data-split-theme="d" data-split-icon="gear"></ul>');
    html.attr("id", item.topic);
    html.attr("data-id", item.id);
    html.find("h2").text(item.topic);
    $("#list_topics").append(html);
    $("#list_topics").collapsibleset("refresh");
}
function topics_add() {
    var topic = $("#topic_add").find("#topic_add_textbox").val();
    server.Topics.add({
        topic: topic
    })
    .done(function (item) {
        var item = item[0];
        topics_ui_add(item);
        cards_load(item.id.toString());
        $("#adddialog").find("#select_topic").append(new Option(item.topic, item.id));      
        $("#topic_remove").find("#topic_remove_select").append(new Option(item.topic, item.id)).selectmenu('refresh');
    });
}
function find_topic_list(id) {
    var list = $("#list_topics").find("[data-id='" + id + "']").find("ul");
    return list[0]
}
function cards_load(id) {    
    server.Cards.query('topic').only(id).execute()
                    .done(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            var item = results[i];
                            var list = find_topic_list(item.topic);
                            cards_ui_add(item, list);
                        };                        
                    });
}
function cards_ui_add(item, list) {
    if (list) {
        var html = $('<li><a id="main_link"></a><a href="#"  id="edit_link">Edit</a></li>');
        html.attr("id", item.id);
        html.find("a#main_link").text(item.question);
        html.find("a#main_link").click(function () { card_page_show(item.id, item.topic, item.question, item.answer);});
        html.find("a#edit_link").click(function () { card_editpage_show(item.id, item.topic, item.question, item.answer); });
        var list = $(list);
        list.append(html);
        if (list.hasClass('ui-listview')) {
            list.listview('refresh');
        }
        else {
            list.listview();
            
        }

    }
}
function cards_add() {    
        var dialog = $("#adddialog");
        var topic = dialog.find("#select_topic").val();
        var question = dialog.find("#textarea_question").val();
        var answer = dialog.find("#textarea_answer").val();
        server.Cards.add({
            topic: topic,
            question: question,
            answer: answer
        }).done(function (item) {
            var item = item[0];
            var list = find_topic_list(item.topic);
            cards_ui_add(item, list);
        });    
}
function card_page_show(id,topic,question,answer) {    
    var cardpage = $("#cardview");
    cardpage.find("#cardview_topic").text(get_topic_name(topic));
    cardpage.find("#cardview_question").text(question);
    cardpage.find("#cardview_answer").text(answer);
    cardpage.find("#cardview_answer").hide()
    $.mobile.changePage('#cardview', 'pop', true, true);

}
function card_editpage_show(id, topic, question, answer) {    
    var page = $("#editview");        
    page.find("#editview_topic").text(get_topic_name(topic));
    page.find("#editview_question").val(question);
    page.find("#editview_answer").val(answer);    
    page.find("#editview_save_btn").click(function () { card_update(id);});
    page.find("#editview_delete_btn").click(function () { card_delete(id,topic);});
    $.mobile.changePage('#editview', 'pop', true, true);    
}
function card_update(id) {    
    server.Cards.get(id).done(function (item) {
        var id = item.id;
        var page = $("#editview");
        var topic = item.topic;
        var question = page.find("#editview_question").val();
        var answer = page.find("#editview_answer").val();
        item.question = question;
        item.answer = answer;
        server.Cards.update(item)
                        .done(function (item) {
                            var item = item[0];
                            var id = item.id;
                            var list = $(find_topic_list(item.topic));
                            var widget = list.find("li#" + id);
                            widget.remove();
                            cards_ui_add(item, list);                          
                            $.mobile.changePage('#add', 'pop', true, true);
                        });

    });

}
function card_delete(id,topic) {      
    server.Cards.remove(id).done(function (id) {        
        var list = $(find_topic_list(topic));
        var widget = list.find("li#" + id);
        widget.remove();
        $.mobile.changePage('#add', 'pop', true, true);
    });

}
function topic_remove() {
    var page = $("#topic_remove")
    var topic = page.find("#topic_remove_select").val();
    var list = $(find_topic_list(topic));
    var cards = list.find("li");
    var droplist = $("#list_topics").find("#" + topic)
    var droplist_id = droplist.data().id
    for (var i = 0; i < cards.length; i++) {
        var card = $(cards[i]);
        var id = card.attr("id");
        server.Cards.remove(id).done(function (id) {
            var card = list.find("li#" + id);
            card.remove();
        });
    };
    list.remove();
    server.Topics.remove(droplist_id).done(function (id) {
       
    });    
    droplist.remove();
    $("#list_topics").collapsibleset("refresh");

}
function get_topic_name(id) {
    var topic;
    var list = $("#list_topics").find("[data-id='" + id + "']");
    topic = $(list).attr("id");
    return topic
}