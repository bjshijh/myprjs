var curDG = undefined;
var editIndex = undefined;
function endEditing() {
	if (editIndex == undefined) {
		return true;
	}
	if (curDG.datagrid('validateRow', editIndex)) {

		curDG.datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}
function onClickCell(index, field) {
	if (!curDG)
		return;
	if (editIndex != index) {
		if (endEditing()) {
			curDG.datagrid('selectRow', index).datagrid('beginEdit', index);
			var ed = curDG.datagrid('getEditor', {
				index : index,
				field : field
			});
			($(ed.target).data('textbox') ? $(ed.target).textbox('textbox')
					: $(ed.target)).focus();
			editIndex = index;
		} else {
			curDG.datagrid('selectRow', editIndex);
		}
	}
}

function getEditRow() {
	if (editIndex == undefined) {
		return null;
	} else { 
		return curDG.datagrid('getRows')[editIndex];
	}
}

function append() {
	if (endEditing()) {
		curDG.datagrid('appendRow', {
			status : 'P'
		});
		editIndex = curDG.datagrid('getRows').length - 1;
		curDG.datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
	}
}

function removeit() {
	if (editIndex == undefined) {
		return
	}
	//curDG.datagrid('cancelEdit', editIndex).datagrid('deleteRow', editIndex);
	curDG.datagrid('deleteRow', editIndex);
	
	editIndex = undefined;
}
function accept() {
	if (endEditing()) {
		curDG.datagrid('acceptChanges');
	}
}
function reject() {
	curDG.datagrid('rejectChanges');
	editIndex = undefined;
}
function getChanges() {
	endEditing();
	var rows = curDG.datagrid('getChanges');
	accept();
	return rows;
}