/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new dialog.
 */
function Dialog(editorUi, elt, w, h, modal, closable, onClose)
{
	var dx = 0;
	
	if (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8))
	{
		// Adds padding as a workaround for box model in older IE versions
		// This needs to match the total padding of geDialog in CSS
		dx = 80;
	}

	w += dx;
	h += dx;
	
	var left = Math.max(0, Math.round((editorUi.container.scrollWidth - w) / 2));
	var top = Math.max(0, Math.round((Math.max(editorUi.container.scrollHeight, document.documentElement.scrollHeight) - h - editorUi.footerHeight) / 3));
	
	// Increments zIndex to put subdialogs and background over existing dialogs and background
	if (editorUi.dialogs.length > 0)
	{
		this.zIndex += editorUi.dialogs.length * 2;
	}
	
	var div = editorUi.createDiv('geDialog');
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	div.style.left = left + 'px';
	div.style.top = top + 'px';
	div.style.zIndex = this.zIndex;
	
	if (this.bg == null)
	{
		this.bg = editorUi.createDiv('background');
		this.bg.style.position = 'absolute';
		this.bg.style.background = 'white';
		this.bg.style.left = '0px';
		this.bg.style.top = '0px';
		this.bg.style.bottom = '0px';
		this.bg.style.right = '0px';
		this.bg.style.zIndex = this.zIndex - 2;
		
		mxUtils.setOpacity(this.bg, this.bgOpacity);
		
		if (mxClient.IS_QUIRKS)
		{
			new mxDivResizer(this.bg);
		}
	}

	if (modal)
	{
        editorUi.container.appendChild(this.bg);
	}
	
	div.appendChild(elt);
    editorUi.container.appendChild(div);
	
	if (closable)
	{
		var img = document.createElement('img');

		img.setAttribute('src', Dialog.prototype.closeImage);
		img.setAttribute('title', mxResources.get('close'));
		img.className = 'geDialogClose';
		img.style.top = (top + 14) + 'px';
		img.style.left = (left + w + 38 - dx) + 'px';
		img.style.zIndex = this.zIndex;
		
		mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
		{
			editorUi.hideDialog(true);
		}));

        editorUi.container.appendChild(img);
		this.dialogImg = img;
		
		mxEvent.addListener(this.bg, 'click', mxUtils.bind(this, function()
		{
			editorUi.hideDialog(true);
		}));
	}
	
	this.onDialogClose = onClose;
	this.container = div;
	
	editorUi.editor.fireEvent(new mxEventObject('showDialog'));
};

/**
 * 
 */
Dialog.prototype.zIndex = mxPopupMenu.prototype.zIndex - 1;

/**
 * 
 */
Dialog.prototype.noColorImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/nocolor.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzRDlBMUUwODYxMTExRTFCMzA4RDdDMjJBMEMxRDM3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzRDlBMUUxODYxMTExRTFCMzA4RDdDMjJBMEMxRDM3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTNEOUExREU4NjExMTFFMUIzMDhEN0MyMkEwQzFEMzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTNEOUExREY4NjExMTFFMUIzMDhEN0MyMkEwQzFEMzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5xh3fmAAAABlBMVEX////MzMw46qqDAAAAGElEQVR42mJggAJGKGAYIIGBth8KAAIMAEUQAIElnLuQAAAAAElFTkSuQmCC';

/**
 * 
 */
Dialog.prototype.closeImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/close.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJAQMAAADaX5RTAAAABlBMVEV7mr3///+wksspAAAAAnRSTlP/AOW3MEoAAAAdSURBVAgdY9jXwCDDwNDRwHCwgeExmASygSL7GgB12QiqNHZZIwAAAABJRU5ErkJggg==';

/**
 * 
 */
Dialog.prototype.clearImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/clear.gif' : 'data:image/gif;base64,R0lGODlhDQAKAIABAMDAwP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUIzOEM1NzI4NjEyMTFFMUEzMkNDMUE3NjZERDE2QjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUIzOEM1NzM4NjEyMTFFMUEzMkNDMUE3NjZERDE2QjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QjM4QzU3MDg2MTIxMUUxQTMyQ0MxQTc2NkREMTZCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QjM4QzU3MTg2MTIxMUUxQTMyQ0MxQTc2NkREMTZCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAEALAAAAAANAAoAAAIXTGCJebD9jEOTqRlttXdrB32PJ2ncyRQAOw==';

/**
 * 
 */
Dialog.prototype.editImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/edit.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJFSURBVFiF3Ze/axNhGMc/T34jCLoI4uIJyZkKVdE2IkiNgrMidnJxcRGUgOL/oAFFB3FREB10VHSsk9jEOCiS3KVopEtxsFVQbDG5x6GUavtekrsmKfWZ7u778Hw/7/M+7x0nqsp6RmRd3Tc0gIj0BF7CzIBt5woCRaCBclei3KvVSl8HAmDbh3cIrU9A4q/H84qcdt3JF0EBQrTRK6wwB0iJ6KXgtQICWNb+LYKeN2mq+jYMQCxIcjKeuABsNkgL0ah3G8C2cydFZOfqFH3vOKWJ0ACWlU8lE1z0kR9Wq5UZERE7PTIGWCsTBDYB4QGSyZ/nUNlmkFRpFRcvVIFCtzWhyxkQGY+ictkoqj5z3YoTxDQwQCYzfQbYZa6g18KaQ5dbIOhVH+G147x5BZBNj46pSNa3SERnHaf8JDBANn3oBBH2mTRVllcf4Riw16+OamTOsvJPG42X8/+sodObcLedmwDyBqnu1stZVfXaFugQbWfAtkdHfMxRtLhW844AIhj3XuGL5809WKs5tJmBbDaXQeWUSYvALXdqagEWuyQqBzo6BR1C9biCuUM/4snEnaUbUTkKHO/kryqzXQ/h0NDB7V4r+pnVXz1QvenUy4Hedu3COAOeFxs3mkMz1vJu9MrcF0A84sZs5fGHj5XpvgN4oi2jv3C9l+a+ACKy8nx/Q/Ss65beDQZAlzsg8ByJ73Gc8qNem4PfMVR+I3xHpVCrT97vh/FSGI/h8PCRrc3mr1S1Wpnpp7kvwCBj4/6a/TcAfwDYcdFseNencAAAAABJRU5ErkJggg==';

/**
 *
 */
Dialog.prototype.addImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/add.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIXSURBVFiFzZe/attQFIe/I9vQRzCpp4KRUrIU/G9xoFBoDS3Ea7a+RrvnOTp1bSBD3KUFd5GSQJeQyGjoYoc8gim1TodaQpaU+jqO5fw2Sdfn+7jyvfdIVJVtxtoqHSivMti2W89EeYvFvqjUFHYABG5UdEzIEEtOfN/7ZVpTTF6BbbdeCXIENE2KKrgifPR979taAnt7reqf3/IJ4bUJOCeDckXfX16e3a4s4DjtBsox8PSe8CgThAPf9y6MBZ7XO53Q0u/AkzXhUaZWKC+vAtddKlCvd2olS8+B6gPBo9zOQmkGgTtO3swsw5Kln43hoj1Ee4YC1XntVInEDNh2+0Dgi2FB/JEnAI7dNt7NFPqjkXccXS/MgMCRaaH7Js2IBer15gtgd9MCwO6ctShgWaV3BcAzrFhA0P2iBJKs5H+gVpRAkpU8jHZyh4r2fP9s8L9q0WpIx3Fab1A5zXkUsx7VcXwD2JkRKqeO3c798fJ9IHdiIhawOAPjnIGbSsyKBRQZFkVPsmKBMJydFCWQZMUCQXD+E7gugH89Zy0KACh82DQ9zcj0A47dHgJdo2rRUZy/1vPywx95CztupiuehXJo3JCYg+FfQ3KYvpnZiILAHVuh9IHpCsWXZWqF0k93Q7kCAFeB6yJ0gckDwCcI3bx+8E4BAN/3LsoVbaB8XQM+KFe0cVdHDI/9wyRHZDufZpvM1o/jv1853ddhRcR9AAAAAElFTkSuQmCC';

/**
 *
 */
Dialog.prototype.lockedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/locked.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzdDMDZCODExNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzdDMDZCODIxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozN0MwNkI3RjE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozN0MwNkI4MDE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvqMCFYAAAAVUExURZmZmb+/v7KysqysrMzMzLGxsf///4g8N1cAAAAHdFJOU////////wAaSwNGAAAAPElEQVR42lTMQQ4AIQgEwUa0//9kTQirOweYOgDqAMbZUr10AGlAwx4/BJ2QJ4U0L5brYjovvpv32xZgAHZaATFtMbu4AAAAAElFTkSuQmCC';
/**
 * 
 */
Dialog.prototype.unlockedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/unlocked.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzdDMDZCN0QxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzdDMDZCN0UxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozN0MwNkI3QjE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozN0MwNkI3QzE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkKMpVwAAAAYUExURZmZmbKysr+/v6ysrOXl5czMzLGxsf///zHN5lwAAAAIdFJOU/////////8A3oO9WQAAADxJREFUeNpUzFESACAEBNBVsfe/cZJU+8Mzs8CIABCidtfGOndnYsT40HDSiCcbPdoJo10o9aI677cpwACRoAF3dFNlswAAAABJRU5ErkJggg==';

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.bgOpacity = 80;

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.close = function(cancel)
{
	if (this.onDialogClose != null)
	{
		this.onDialogClose(cancel);
		this.onDialogClose = null;
	}
	
	if (this.dialogImg != null)
	{
		this.dialogImg.parentNode.removeChild(this.dialogImg);
		this.dialogImg = null;
	}
	
	if (this.bg != null && this.bg.parentNode != null)
	{
		this.bg.parentNode.removeChild(this.bg);
	}
	
	this.container.parentNode.removeChild(this.container);
};

/**
 * Constructs a new open dialog.
 */
var OpenDialog = function()
{
	var iframe = document.createElement('iframe');
	iframe.style.backgroundColor = 'transparent';
	iframe.allowTransparency = 'true';
	iframe.style.borderStyle = 'none';
	iframe.style.borderWidth = '0px';
	iframe.style.overflow = 'hidden';
	iframe.frameBorder = '0';
	
	// Adds padding as a workaround for box model in older IE versions
	var dx = (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8)) ? 20 : 0;
	
	iframe.setAttribute('width', (((Editor.useLocalStorage) ? 640 : 320) + dx) + 'px');
	iframe.setAttribute('height', (((Editor.useLocalStorage) ? 480 : 220) + dx) + 'px');
	iframe.setAttribute('src', OPEN_FORM);
	
	this.container = iframe;
};

/**
 * Constructs a new color dialog.
 */
var ColorDialog = function(editorUi, color, apply, cancelFn)
{
	this.editorUi = editorUi;
	
	var input = document.createElement('input');
	input.style.marginBottom = '10px';
	input.style.width = '216px';
	
	// Required for picker to render in IE
	if (mxClient.IS_IE)
	{
		input.style.marginTop = '10px';
        editorUi.container.appendChild(input);
	}
	
	this.init = function()
	{
		if (!mxClient.IS_TOUCH)
		{
			input.focus();
		}
	};

	var picker = new jscolor.color(input);
	picker.pickerOnfocus = false;
	picker.showPicker();

	var div = document.createElement('div');
	jscolor.picker.box.style.position = 'relative';
	jscolor.picker.box.style.width = '230px';
	jscolor.picker.box.style.height = '100px';
	jscolor.picker.box.style.paddingBottom = '10px';
	div.appendChild(jscolor.picker.box);

	var center = document.createElement('center');
	
	function addPresets(presets, rowLength, defaultColor)
	{
		rowLength = (rowLength != null) ? rowLength : 12;
		var table = document.createElement('table');
		table.style.borderCollapse = 'collapse';
		table.setAttribute('cellspacing', '0');
		table.style.marginBottom = '20px';
		table.style.cellSpacing = '0px';
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		var rows = presets.length / rowLength;
		
		for (var row = 0; row < rows; row++)
		{
			var tr = document.createElement('tr');
			
			for (var i = 0; i < rowLength; i++)
			{
				(function(clr)
				{
					var td = document.createElement('td');
					td.style.border = '1px solid black';
					td.style.padding = '0px';
					td.style.width = '16px';
					td.style.height = '16px';
					
					if (clr == null)
					{
						clr = defaultColor;
					}
					
					if (clr == 'none')
					{
						td.style.background = 'url(\'' + Dialog.prototype.noColorImage + '\')';
					}
					else
					{
						td.style.backgroundColor = '#' + clr;
					}
					
					tr.appendChild(td);

					if (clr != null)
					{
						td.style.cursor = 'pointer';
						
						mxEvent.addListener(td, 'click', function()
						{
							if (clr == 'none')
							{
								picker.fromString('ffffff');
								input.value = 'none';
							}
							else
							{
								picker.fromString(clr);
							}
						});
					}
				})(presets[row * rowLength + i]);
			}
			
			tbody.appendChild(tr);
		}
		
		center.appendChild(table);
		
		return table;
	};

	div.appendChild(input);
	mxUtils.br(div);
	
	// Adds recent colors
	var table = addPresets((ColorDialog.recentColors.length == 0) ? ['FFFFFF'] : ColorDialog.recentColors, 12, 'FFFFFF');
	table.style.marginBottom = '8px';
		
	// Adds presets
	var table = addPresets(['E6D0DE', 'CDA2BE', 'B5739D', 'E1D5E7', 'C3ABD0', 'A680B8', 'D4E1F5', 'A9C4EB', '7EA6E0', 'D5E8D4', '9AC7BF', '67AB9F', 'D5E8D4', 'B9E0A5', '97D077', 'FFF2CC', 'FFE599', 'FFD966', 'FFF4C3', 'FFCE9F', 'FFB570', 'F8CECC', 'F19C99', 'EA6B66'], 12);
	table.style.marginBottom = '8px';
	table = addPresets(['none', 'FFFFFF', 'E6E6E6', 'CCCCCC', 'B3B3B3', '999999', '808080', '666666', '4D4D4D', '333333', '1A1A1A', '000000', 'FFCCCC', 'FFE6CC', 'FFFFCC', 'E6FFCC', 'CCFFCC', 'CCFFE6', 'CCFFFF', 'CCE5FF', 'CCCCFF', 'E5CCFF', 'FFCCFF', 'FFCCE6', 'FF9999', 'FFCC99', 'FFFF99', 'CCFF99', '99FF99', '99FFCC', '99FFFF', '99CCFF', '9999FF', 'CC99FF', 'FF99FF', 'FF99CC', 'FF6666', 'FFB366', 'FFFF66', 'B3FF66', '66FF66', '66FFB3', '66FFFF', '66B2FF', '6666FF', 'B266FF', 'FF66FF', 'FF66B3', 'FF3333', 'FF9933', 'FFFF33', '99FF33', '33FF33', '33FF99', '33FFFF', '3399FF', '3333FF', '9933FF', 'FF33FF', 'FF3399', 'FF0000', 'FF8000', 'FFFF00', '80FF00', '00FF00', '00FF80', '00FFFF', '007FFF', '0000FF', '7F00FF', 'FF00FF', 'FF0080', 'CC0000', 'CC6600', 'CCCC00', '66CC00', '00CC00', '00CC66', '00CCCC', '0066CC', '0000CC', '6600CC', 'CC00CC', 'CC0066', '990000', '994C00', '999900', '4D9900', '009900', '00994D', '009999', '004C99', '000099', '4C0099', '990099', '99004D', '660000', '663300', '666600', '336600', '006600', '006633', '006666', '003366', '000066', '330066', '660066', '660033', '330000', '331A00', '333300', '1A3300', '003300', '00331A', '003333', '001933', '000033', '190033', '330033', '33001A']);
	table.style.marginBottom = '16px';

	div.appendChild(center);

	var buttons = document.createElement('div');
	buttons.style.textAlign = 'right';
	buttons.style.whiteSpace = 'nowrap';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}
	
	var applyFunction = (apply != null) ? apply : this.createApplyFunction();
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		var color = input.value;
		ColorDialog.addRecentColor(color, 12);
		
		if (color != 'none' && color.charAt(0) != '#')
		{
			color = '#' + color;
		}

		applyFunction(color);
		editorUi.hideDialog();
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	buttons.appendChild(applyBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}
	
	if (color != null)
	{
		if (color == 'none')
		{
			picker.fromString('ffffff');
			input.value = 'none';
		}
		else
		{
			picker.fromString(color);
		}
	}
	
	div.appendChild(buttons);
	this.picker = picker;
	this.colorInput = input;

	// LATER: Only fires if input if focused, should always
	// fire if this dialog is showing.
	mxEvent.addListener(div, 'keydown', function(e)
	{
		if (e.keyCode == 27)
		{
			editorUi.hideDialog();
			
			if (cancelFn != null)
			{
				cancelFn();
			}
			
			mxEvent.consume(e);
		}
	});
	
	this.container = div;
};

/* Creates function to apply value */
ColorDialog.prototype.createApplyFunction = function()
{
	return mxUtils.bind(this, function(color)
	{
		var graph = this.editorUi.editor.graph;
		
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(this.currentColorKey, color);
			this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [this.currentColorKey],
				'values', [color], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
};

/**
 * 
 */
ColorDialog.recentColors = [];

/**
 * Adds recent color for later use.
 */
ColorDialog.addRecentColor = function(color, max)
{
	if (color != null)
	{
		mxUtils.remove(color, ColorDialog.recentColors);
		ColorDialog.recentColors.splice(0, 0, color);
		
		if (ColorDialog.recentColors.length > max)
		{
			ColorDialog.recentColors.pop();
		}
	}
};

/**
 * Constructs a new about dialog.
 */
var AboutDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('about') + ' GraphEditor');
	div.appendChild(h3);
	var img = document.createElement('img');
	img.style.border = '0px';
	img.setAttribute('width', '176');
	img.setAttribute('width', '151');
	img.setAttribute('src', IMAGE_PATH + '/logo.png');
	div.appendChild(img);
	mxUtils.br(div);
	mxUtils.write(div, 'Powered by mxGraph ' + mxClient.VERSION);
	mxUtils.br(div);
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.jgraph.com/');
	link.setAttribute('target', '_blank');
	mxUtils.write(link, 'www.jgraph.com');
	div.appendChild(link);
	mxUtils.br(div);
	mxUtils.br(div);
	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});
	closeBtn.className = 'geBtn gePrimaryBtn';
	div.appendChild(closeBtn);
	
	this.container = div;
};

/**
 * Constructs a new page setup dialog.
 */
var PageSetupDialog = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var row, td;

	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.height = '100%';
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('paperSize') + ':');
	
	row.appendChild(td);

	var portraitCheckBox = document.createElement('input');
	portraitCheckBox.setAttribute('name', 'format');
	portraitCheckBox.setAttribute('type', 'radio');
	portraitCheckBox.setAttribute('value', 'portrait');
	
	var landscapeCheckBox = document.createElement('input');
	landscapeCheckBox.setAttribute('name', 'format');
	landscapeCheckBox.setAttribute('type', 'radio');
	landscapeCheckBox.setAttribute('value', 'landscape');
	
	var formatRow = document.createElement('tr');
	formatRow.style.display = 'none';
	
	var customRow = document.createElement('tr');
	customRow.style.display = 'none';
	
	// Adds all papersize options
	var paperSizeSelect = document.createElement('select');
	var detected = false;
	var pf = new Object();
	var formats = PageSetupDialog.getFormats();

	for (var i = 0; i < formats.length; i++)
	{
		var f = formats[i];
		pf[f.key] = f;

		var paperSizeOption = document.createElement('option');
		paperSizeOption.setAttribute('value', f.key);
		mxUtils.write(paperSizeOption, f.title);
		paperSizeSelect.appendChild(paperSizeOption);
		
		if (f.format != null)
		{
			if (graph.pageFormat.width == f.format.width && graph.pageFormat.height == f.format.height)
			{
				paperSizeOption.setAttribute('selected', 'selected');
				portraitCheckBox.setAttribute('checked', 'checked');
				portraitCheckBox.defaultChecked = true;
				formatRow.style.display = '';
				detected = true;
			}
			else if (graph.pageFormat.width == f.format.height && graph.pageFormat.height == f.format.width)
			{
				paperSizeOption.setAttribute('selected', 'selected');
				landscapeCheckBox.setAttribute('checked', 'checked');
				portraitCheckBox.defaultChecked = true;
				formatRow.style.display = '';
				detected = true;
			}
		}
		// Selects custom format which is last in list
		else if (!detected)
		{
			paperSizeOption.setAttribute('selected', 'selected');
			customRow.style.display = '';
		}
	}
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.appendChild(paperSizeSelect);
	row.appendChild(td);
	
	tbody.appendChild(row);
	
	formatRow = document.createElement('tr');
	formatRow.style.height = '40px';
	td = document.createElement('td');
	formatRow.appendChild(td);

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	
	td.appendChild(portraitCheckBox);
	var span = document.createElement('span');
	mxUtils.write(span, ' ' + mxResources.get('portrait'));
	td.appendChild(span);
	
	mxEvent.addListener(span, 'click', function(evt)
	{
		portraitCheckBox.checked = true;
		mxEvent.consume(evt);
	});
	
	landscapeCheckBox.style.marginLeft = '10px';
	td.appendChild(landscapeCheckBox);
	
	var span = document.createElement('span');
	mxUtils.write(span, ' ' + mxResources.get('landscape'));
	td.appendChild(span);
	
	mxEvent.addListener(span, 'click', function(evt)
	{
		landscapeCheckBox.checked = true;
		mxEvent.consume(evt);
	});

	formatRow.appendChild(td);
	
	tbody.appendChild(formatRow);
	row = document.createElement('tr');
	
	td = document.createElement('td');
	customRow.appendChild(td);

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('size', '6');
	widthInput.setAttribute('value', graph.pageFormat.width);
	td.appendChild(widthInput);
	mxUtils.write(td, ' x ');
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('size', '6');
	heightInput.setAttribute('value', graph.pageFormat.height);
	td.appendChild(heightInput);
	mxUtils.write(td, ' pt');
	
	customRow.appendChild(td);
	customRow.style.height = formatRow.style.height;
	tbody.appendChild(customRow);
	
	var updateInputs = function()
	{
		var f = pf[paperSizeSelect.value];
		
		if (f.format != null)
		{
			widthInput.value = f.format.width;
			heightInput.value = f.format.height;
			customRow.style.display = 'none';
			formatRow.style.display = '';
		}
		else
		{
			formatRow.style.display = 'none';
			customRow.style.display = '';
		}
	};
	
	mxEvent.addListener(paperSizeSelect, 'change', updateInputs);
	updateInputs();
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	mxUtils.write(td, mxResources.get('background') + ':');
	
	row.appendChild(td);
	
	td = document.createElement('td');
	td.style.whiteSpace = 'nowrap';
	
	var backgroundInput = document.createElement('input');
	backgroundInput.setAttribute('type', 'text');
	var backgroundButton = document.createElement('button');
	
	backgroundButton.style.width = '18px';
	backgroundButton.style.height = '18px';
	backgroundButton.style.marginRight = '20px';
	backgroundButton.style.backgroundPosition = 'center center';
	backgroundButton.style.backgroundRepeat = 'no-repeat';
	
	var newBackgroundColor = graph.background;
	
	function updateBackgroundColor()
	{
		if (newBackgroundColor == null || newBackgroundColor == mxConstants.NONE)
		{
			backgroundButton.style.backgroundColor = '';
			backgroundButton.style.backgroundImage = 'url(\'' + Dialog.prototype.noColorImage + '\')';
		}
		else
		{
			backgroundButton.style.backgroundColor = newBackgroundColor;
			backgroundButton.style.backgroundImage = '';
		}
	};
	
	updateBackgroundColor();

	mxEvent.addListener(backgroundButton, 'click', function(evt)
	{
		editorUi.pickColor(newBackgroundColor || 'none', function(color)
		{
			newBackgroundColor = color;
			updateBackgroundColor();
		});
		mxEvent.consume(evt);
	});
	
	td.appendChild(backgroundButton);
	
	mxUtils.write(td, mxResources.get('gridSize') + ':');
	
	var gridSizeInput = document.createElement('input');
	gridSizeInput.setAttribute('type', 'number');
	gridSizeInput.setAttribute('min', '0');
	gridSizeInput.style.width = '40px';
	gridSizeInput.style.marginLeft = '6px';
	
	gridSizeInput.value = graph.getGridSize();
	td.appendChild(gridSizeInput);
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	td = document.createElement('td');
	
	mxUtils.write(td, mxResources.get('image') + ':');
	
	row.appendChild(td);
	td = document.createElement('td');
	
	var changeImageLink = document.createElement('a');
	changeImageLink.style.textDecoration = 'underline';
	changeImageLink.style.cursor = 'pointer';
	changeImageLink.style.color = '#a0a0a0';
	
	var newBackgroundImage = graph.backgroundImage;
	
	function updateBackgroundImage()
	{
		if (newBackgroundImage == null)
		{
			changeImageLink.removeAttribute('title');
			changeImageLink.style.fontSize = '';
			changeImageLink.innerHTML = mxResources.get('change') + '...';
		}
		else
		{
			changeImageLink.setAttribute('title', newBackgroundImage.src);
			changeImageLink.style.fontSize = '11px';
			changeImageLink.innerHTML = newBackgroundImage.src.substring(0, 42) + '...';
		}
	};
	
	mxEvent.addListener(changeImageLink, 'click', function(evt)
	{
		editorUi.showBackgroundImageDialog(function(image)
		{
			newBackgroundImage = image;
			updateBackgroundImage();
		});
		
		mxEvent.consume(evt);
	});
	
	updateBackgroundImage();

	td.appendChild(changeImageLink);
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '16px';
	td.setAttribute('align', 'right');

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();
		var ls = landscapeCheckBox.checked;
		var f = pf[paperSizeSelect.value];
		var size = f.format;
		
		if (size == null)
		{
			size = new mxRectangle(0, 0, parseInt(widthInput.value), parseInt(heightInput.value));
		}
		
		if (ls)
		{
			size = new mxRectangle(0, 0, size.height, size.width);
		}

		editorUi.setPageFormat(size);
		
		if (graph.background != newBackgroundColor)
		{
			editorUi.setBackgroundColor(newBackgroundColor);
		}
		
		if (graph.backgroundImage !== newBackgroundImage)
		{
			editorUi.setBackgroundImage(newBackgroundImage);
		}
		
		if (graph.gridSize !== gridSizeInput.value)
		{
			graph.setGridSize(parseFloat(gridSizeInput.value));
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	td.appendChild(applyBtn);

	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	row.appendChild(td);
	tbody.appendChild(row);
	
	table.appendChild(tbody);
	this.container = table;
};

/**
 * 
 */
PageSetupDialog.getFormats = function()
{
	return [{key: 'letter', title: 'US-Letter (8,5" x 11")', format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT},
	        {key: 'legal', title: 'US-Legal (8,5" x 14")', format: new mxRectangle(0, 0, 850, 1400)},
	        {key: 'tabloid', title: 'US-Tabloid (279 mm x 432 mm)', format: new mxRectangle(0, 0, 1100, 1700)},
	        {key: 'a3', title: 'A3 (297 mm x 420 mm)', format: new mxRectangle(0, 0, 1169, 1652)},
	        {key: 'a4', title: 'A4 (210 mm x 297 mm)', format: mxConstants.PAGE_FORMAT_A4_PORTRAIT},
	        {key: 'a5', title: 'A5 (148 mm x 210 mm)', format: new mxRectangle(0, 0, 584, 826)},
	        {key: 'custom', title: mxResources.get('custom'), format: null}];
};

/**
 * Constructs a new print dialog.
 */
var PrintDialog = function(editorUi)
{
	this.create(editorUi);
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.prototype.create = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var row, td;
	
	var table = document.createElement('table');
	table.style.width = '100%';
	table.style.height = '100%';
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	var onePageCheckBox = document.createElement('input');
	onePageCheckBox.setAttribute('type', 'checkbox');
	td = document.createElement('td');
	td.setAttribute('colspan', '2');
	td.style.fontSize = '10pt';
	td.appendChild(onePageCheckBox);
	
	var span = document.createElement('span');
	mxUtils.write(span, ' ' + mxResources.get('fitPage'));
	td.appendChild(span);
	
	mxEvent.addListener(span, 'click', function(evt)
	{
		onePageCheckBox.checked = !onePageCheckBox.checked;
		pageCountCheckBox.checked = !onePageCheckBox.checked;
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(onePageCheckBox, 'change', function()
	{
		pageCountCheckBox.checked = !onePageCheckBox.checked;
	});
	
	row.appendChild(td);
	tbody.appendChild(row);

	row = row.cloneNode(false);
	
	var pageCountCheckBox = document.createElement('input');
	pageCountCheckBox.setAttribute('type', 'checkbox');
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.appendChild(pageCountCheckBox);
	
	var span = document.createElement('span');
	mxUtils.write(span, ' ' + mxResources.get('posterPrint') + ':');
	td.appendChild(span);
	
	mxEvent.addListener(span, 'click', function(evt)
	{
		pageCountCheckBox.checked = !pageCountCheckBox.checked;
		onePageCheckBox.checked = !pageCountCheckBox.checked;
		mxEvent.consume(evt);
	});
	
	row.appendChild(td);
	
	var pageCountInput = document.createElement('input');
	pageCountInput.setAttribute('value', '1');
	pageCountInput.setAttribute('type', 'number');
	pageCountInput.setAttribute('min', '1');
	pageCountInput.setAttribute('size', '4');
	pageCountInput.setAttribute('disabled', 'disabled');
	pageCountInput.style.width = '50px';

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.appendChild(pageCountInput);
	mxUtils.write(td, ' ' + mxResources.get('pages') + ' (max)');
	row.appendChild(td);
	tbody.appendChild(row);

	mxEvent.addListener(pageCountCheckBox, 'change', function()
	{
		if (pageCountCheckBox.checked)
		{
			pageCountInput.removeAttribute('disabled');
		}
		else
		{
			pageCountInput.setAttribute('disabled', 'disabled');
		}

		onePageCheckBox.checked = !pageCountCheckBox.checked;
	});

	row = row.cloneNode(false);
	
	td = document.createElement('td');
	mxUtils.write(td, mxResources.get('pageScale') + ':');
	row.appendChild(td);
	
	td = document.createElement('td');
	var pageScaleInput = document.createElement('input');
	pageScaleInput.setAttribute('value', '100 %');
	pageScaleInput.setAttribute('size', '5');
	pageScaleInput.style.width = '50px';
	
	td.appendChild(pageScaleInput);
	row.appendChild(td);
	tbody.appendChild(row);
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.setAttribute('align', 'right');
	
	// Overall scale for print-out to account for print borders in dialogs etc
	function preview(print)
	{
		var autoOrigin = onePageCheckBox.checked || pageCountCheckBox.checked;
		var printScale = parseInt(pageScaleInput.value) / 100;
		
		if (isNaN(printScale))
		{
			printScale = 1;
			pageScaleInput.value = '100%';
		}
		
		// Workaround to match available paper size in actual print output
		printScale *= 0.75;

		var pf = graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		var scale = 1 / graph.pageScale;
		
		if (autoOrigin)
		{
    		var pageCount = (onePageCheckBox.checked) ? 1 : parseInt(pageCountInput.value);
			
			if (!isNaN(pageCount))
			{
				scale = mxUtils.getScaleForPageCount(pageCount, graph, pf);
			}
		}

		// Negative coordinates are cropped or shifted if page visible
		var gb = graph.getGraphBounds();
		var border = 0;
		var x0 = 0;
		var y0 = 0;

		// Applies print scale
		pf = mxRectangle.fromRectangle(pf);
		pf.width = Math.ceil(pf.width * printScale);
		pf.height = Math.ceil(pf.height * printScale);
		scale *= printScale;
		
		// Starts at first visible page
		if (!autoOrigin && graph.pageVisible)
		{
			var layout = graph.getPageLayout();
			x0 -= layout.x * pf.width;
			y0 -= layout.y * pf.height;
		}
		else
		{
			autoOrigin = true;
		}
		
		return PrintDialog.showPreview(PrintDialog.createPrintPreview(graph, scale, pf, border, x0, y0, autoOrigin, print), print);
	};
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	if (!mxClient.IS_CHROMEAPP)
	{
		var previewBtn = mxUtils.button(mxResources.get('preview'), function()
		{
			editorUi.hideDialog();
			preview(false);
		});
		previewBtn.className = 'geBtn';
		td.appendChild(previewBtn);
	}
	
	var printBtn = mxUtils.button(mxResources.get((mxClient.IS_CHROMEAPP) ? 'ok' : 'print'), function()
	{
		editorUi.hideDialog();
		preview(true);
	});
	printBtn.className = 'geBtn gePrimaryBtn';
	td.appendChild(printBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.showPreview = function(preview, print)
{
	var result = preview.open();
	
	if (print && result != null)
	{
		var print = function()
		{
			result.focus();
			result.print();
			result.close();
		};
		
		// Workaround for Google Chrome which needs a bit of a
		// delay in order to render the SVG contents
		// Needs testing in production
		if (mxClient.IS_GC)
		{
			window.setTimeout(print, 500);
		}
		else
		{
			print();
		}
	}
	
	return result;
};

/**
 * Constructs a new print dialog.
 */
PrintDialog.createPrintPreview = function(graph, scale, pf, border, x0, y0, autoOrigin)
{
	var preview = new mxPrintPreview(graph, scale, pf, border, x0, y0);
	preview.title = mxResources.get('preview');
	preview.printBackgroundImage = true;
	preview.autoOrigin = autoOrigin;
	var bg = graph.background;
	
	if (bg == null || bg == '' || bg == mxConstants.NONE)
	{
		bg = '#ffffff';
	}
	
	preview.backgroundColor = bg;
	
	var writeHead = preview.writeHead;
	
	// Adds a border in the preview
	preview.writeHead = function(doc)
	{
		writeHead.apply(this, arguments);
		
		doc.writeln('<style type="text/css">');
		doc.writeln('@media screen {');
		doc.writeln('  body > div { padding:30px;box-sizing:content-box; }');
		doc.writeln('}');
		doc.writeln('</style>');
	};
	
	return preview;
};

/**
 * Constructs a new filename dialog.
 */
var FilenameDialog = function(editorUi, filename, buttonText, fn, label, validateFn, content, helpLink, closeOnBtn)
{
	closeOnBtn = (closeOnBtn != null) ? closeOnBtn : true;
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.style.marginTop = '8px';
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '120px';
	mxUtils.write(td, (label || mxResources.get('filename')) + ':');
	
	row.appendChild(td);
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', filename || '');
	nameInput.style.width = '180px';
	
	var genericBtn = mxUtils.button(buttonText, function()
	{
		if (validateFn == null || validateFn(nameInput.value))
		{
			if (closeOnBtn)
			{
				editorUi.hideDialog();
			}
			
			fn(nameInput.value);
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	
	this.init = function()
	{
		if (label == null && content != null)
		{
			return;
		}
		
		nameInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			nameInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
		
		// Installs drag and drop handler for links
		if (Graph.fileSupport)
		{
			// Setup the dnd listeners
			var dlg = table.parentNode;
			var graph = editorUi.editor.graph;
			var dropElt = null;
				
			mxEvent.addListener(dlg, 'dragleave', function(evt)
			{
				if (dropElt != null)
			    {
					dropElt.style.backgroundColor = '';
			    	dropElt = null;
			    }
			    
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt)
			{
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
				{
					dropElt = nameInput;
					dropElt.style.backgroundColor = '#ebf2f9';
				}
				
				evt.stopPropagation();
				evt.preventDefault();
			}));
					
			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
			{
			    if (dropElt != null)
			    {
					dropElt.style.backgroundColor = '';
			    	dropElt = null;
			    }

			    if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
			    {
			    	nameInput.value = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
			    	genericBtn.click();
			    }

			    evt.stopPropagation();
			    evt.preventDefault();
			}));
		}
	};

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	if (label != null || content == null)
	{
		tbody.appendChild(row);
	}
	
	if (content != null)
	{
		row = document.createElement('tr');
		td = document.createElement('td');
		td.colSpan = 2;
		td.appendChild(content);
		row.appendChild(td);
		tbody.appendChild(row);
	}
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.colSpan = 2;
	td.style.paddingTop = '20px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	if (helpLink != null)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			window.open(helpLink);
		});
		
		helpBtn.className = 'geBtn';	
		td.appendChild(helpBtn);
	}

	mxEvent.addListener(nameInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			genericBtn.click();
		}
	});
	
	td.appendChild(genericBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	
	this.container = table;
};

/**
 * Constructs a new textarea dialog.
 */
var TextareaDialog = function(editorUi, title, url, fn, cancelFn, cancelTitle, w, h, addButtons, noHide)
{
	w = (w != null) ? w : 300;
	h = (h != null) ? h : 120;
	noHide = (noHide != null) ? noHide : false;
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, title);
	
	row.appendChild(td);
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');

	var nameInput = document.createElement('textarea');
	mxUtils.write(nameInput, url || '');
	nameInput.style.resize = 'none';
	nameInput.style.width = w + 'px';
	nameInput.style.height = h + 'px';
	
	this.textarea = nameInput;

	this.init = function()
	{
		nameInput.focus();
		nameInput.scrollTop = 0;
	};

	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.style.paddingTop = '14px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');
	
	var cancelBtn = mxUtils.button(cancelTitle || mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}
	
	if (addButtons != null)
	{
		addButtons(td);
	}
	
	if (fn != null)
	{
		var genericBtn = mxUtils.button(mxResources.get('apply'), function()
		{
			if (!noHide)
			{
				editorUi.hideDialog();
			}
			
			fn(nameInput.value);
		});
		
		genericBtn.className = 'geBtn gePrimaryBtn';	
		td.appendChild(genericBtn);
	}
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Constructs a new edit file dialog.
 */
var EditDiagramDialog = function(editorUi, type)
{
	var div = document.createElement('div');
	// div.style.textAlign = 'right';
	var textarea = document.createElement('textarea');
	textarea.setAttribute('wrap', 'off');
	textarea.style.overflow = 'auto';
	textarea.style.resize = 'none';
	textarea.style.width = '600px';
	textarea.style.height = '370px';
	textarea.style.marginBottom = '16px';

    var graphXml = editorUi.editor.getGraphXml(editorUi), tValue;

	if(type == 'XML')
	{
		tValue = mxUtils.getPrettyXml(graphXml);
	}
	else if (type == 'JSON'){
        var xmlDoc = mxUtils.parseXml(mxUtils.getXml(graphXml));
        tValue = CodeTranslator.xml2json(xmlDoc, "  ");
	}

    textarea.value = tValue;
	div.appendChild(textarea);
	
    this.init = function()
    {
        var code = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            smartIndent: true,
            mode: type == 'XML' ? 'xml' : 'javascript'
        });
        code.on('change', function () {
            textarea.value = code.getValue()
        });
        textarea.focus();
    };
	
	// Enables dropping files
	if (Graph.fileSupport)
	{
		function handleDrop(evt)
		{
		    evt.stopPropagation();
		    evt.preventDefault();
		    
		    if (evt.dataTransfer.files.length > 0)
		    {
    			var file = evt.dataTransfer.files[0];
    			var reader = new FileReader();
				
				reader.onload = function(e)
				{
					textarea.value = e.target.result;
				};
				
				reader.readAsText(file);
    		}
		    else
		    {
		    	textarea.value = editorUi.extractGraphModelFromEvent(evt);
		    }
		};
		
		function handleDragOver(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();
		};

		// Setup the dnd listeners.
		textarea.addEventListener('dragover', handleDragOver, false);
		textarea.addEventListener('drop', handleDrop, false);
	}
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		div.appendChild(cancelBtn);
	}
	
	var select = document.createElement('select');
	select.style.width = '180px';
	select.className = 'geBtn';

	if (editorUi.editor.graph.isEnabled())
	{
		var replaceOption = document.createElement('option');
		replaceOption.setAttribute('value', 'replace');
		mxUtils.write(replaceOption, mxResources.get('replaceExistingDrawing'));
		select.appendChild(replaceOption);
	}

	var newOption = document.createElement('option');
	newOption.setAttribute('value', 'new');
	mxUtils.write(newOption, mxResources.get('openInNewWindow'));
	
	var chromeApp = window.chrome != null && chrome.app != null && chrome.app.runtime != null;
	
	if (!chromeApp)
	{
		select.appendChild(newOption);
	}

	if (editorUi.editor.graph.isEnabled())
	{
		var importOption = document.createElement('option');
		importOption.setAttribute('value', 'import');
		mxUtils.write(importOption, mxResources.get('addToExistingDrawing'));
		select.appendChild(importOption);
	}

	div.appendChild(select);

	var okBtn = mxUtils.button(mxResources.get('ok'), function()
	{
		// Removes all illegal control characters before parsing
		var data = editorUi.editor.graph.zapGremlins(mxUtils.trim(textarea.value));
		var error = null;
		
		if (select.value == 'new')
		{
			window.openFile = new OpenFile(function()
			{
				editorUi.hideDialog();
				window.openFile = null;
			});
			
			window.openFile.setData(data, null);
			window.open(editorUi.getUrl());
		}
		else if (select.value == 'replace')
		{
			editorUi.editor.graph.model.beginUpdate();
			try
			{
				editorUi.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
				// LATER: Why is hideDialog between begin-/endUpdate faster?
				editorUi.hideDialog();
			}
			catch (e)
			{
				error = e;
			}
			finally
			{
				editorUi.editor.graph.model.endUpdate();				
			}
		}
		else if (select.value == 'import')
		{
			editorUi.editor.graph.model.beginUpdate();
			try
			{
				var doc = mxUtils.parseXml(data);
				var model = new mxGraphModel();
				var codec = new mxCodec(doc);
				codec.decode(doc.documentElement, model);
				
				var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
				editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(children));
				
				// LATER: Why is hideDialog between begin-/endUpdate faster?
				editorUi.hideDialog();
			}
			catch (e)
			{
				error = e;
			}
			finally
			{
				editorUi.editor.graph.model.endUpdate();				
			}
		}
			
		if (error != null)
		{
			mxUtils.alert(error.message);
		}
	});
	okBtn.className = 'geBtn gePrimaryBtn';
	div.appendChild(okBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		div.appendChild(cancelBtn);
	}

	this.container = div;
};

/**
 * Constructs a new export dialog.
 */
var ExportDialog = function(editorUi) {
    var graph = editorUi.editor.graph;
    var bounds = graph.getGraphBounds();
    var scale = graph.view.scale;

    var width = Math.ceil(bounds.width / scale);
    var height = Math.ceil(bounds.height / scale);

    var row, td;

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '10pt';
    td.style.width = '100px';
    mxUtils.write(td, mxResources.get('filename') + ':');

    row.appendChild(td);

    var nameInput = document.createElement('input');
    nameInput.setAttribute('value', editorUi.editor.getOrCreateJsonFilename());
    nameInput.style.width = '180px';

    td = document.createElement('td');
    td.appendChild(nameInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '10pt';
    mxUtils.write(td, mxResources.get('format') + ':');

    row.appendChild(td);

    var imageFormatSelect = document.createElement('select');
    imageFormatSelect.style.width = '100%';

    if (ExportDialog.showJsonOption)
    {
        var jsonOption = document.createElement('option');
        jsonOption.setAttribute('value', 'json');
        mxUtils.write(jsonOption, mxResources.get('formatJson'));
        imageFormatSelect.appendChild(jsonOption);
    }

    if (ExportDialog.showXmlOption)
    {
        var xmlOption = document.createElement('option');
        xmlOption.setAttribute('value', 'xml');
        mxUtils.write(xmlOption, mxResources.get('formatXml'));
        imageFormatSelect.appendChild(xmlOption);
    }

    if (ExportDialog.showYamlOption)
    {
        var yamlOption = document.createElement('option');
        yamlOption.setAttribute('value', 'yaml');
        mxUtils.write(yamlOption, mxResources.get('formatYaml'));
        imageFormatSelect.appendChild(yamlOption);
    }

    if (ExportDialog.showPngOption)
    {
        var pngOption = document.createElement('option');
        pngOption.setAttribute('value', 'png');
        mxUtils.write(pngOption, mxResources.get('formatPng'));
        imageFormatSelect.appendChild(pngOption);
    }

    if (ExportDialog.showGifOption)
    {
        var gifOption = document.createElement('option');
        gifOption.setAttribute('value', 'gif');
        mxUtils.write(gifOption, mxResources.get('formatGif'));
        imageFormatSelect.appendChild(gifOption);
    }

    if (ExportDialog.showJpgOption)
    {
        var jpgOption = document.createElement('option');
        jpgOption.setAttribute('value', 'jpg');
        mxUtils.write(jpgOption, mxResources.get('formatJpg'));
        imageFormatSelect.appendChild(jpgOption);
    }

    if (ExportDialog.showPdfOption)
    {
        var pdfOption = document.createElement('option');
        pdfOption.setAttribute('value', 'pdf');
        mxUtils.write(pdfOption, mxResources.get('formatPdf'));
        imageFormatSelect.appendChild(pdfOption);
    }

    if (ExportDialog.showSvgOption)
    {
        var svgOption = document.createElement('option');
        svgOption.setAttribute('value', 'svg');
        mxUtils.write(svgOption, mxResources.get('formatSvg'));
        imageFormatSelect.appendChild(svgOption);
    }

    td = document.createElement('td');
    td.appendChild(imageFormatSelect);
    row.appendChild(td);

    tbody.appendChild(row);

    var row1 = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '10pt';
    mxUtils.write(td, mxResources.get('backgroundColor') + ':');

    row1.appendChild(td);

    var backgroundInput = document.createElement('input');
    var tmp = (graph.background == null || graph.background == mxConstants.NONE) ? '#ffffff' : graph.background;
    backgroundInput.setAttribute('value', tmp);
    backgroundInput.style.width = '80px';

    var backgroundCheckbox = document.createElement('input');
    backgroundCheckbox.setAttribute('type', 'checkbox');
    backgroundCheckbox.checked = graph.background == null || graph.background == mxConstants.NONE;

    td = document.createElement('td');
    td.appendChild(backgroundInput);
    td.appendChild(backgroundCheckbox);
    mxUtils.write(td, mxResources.get('transparent'));

    row1.appendChild(td);

    tbody.appendChild(row1);

    var row2 = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '10pt';
    mxUtils.write(td, mxResources.get('width') + ':');

    row2.appendChild(td);

    var widthInput = document.createElement('input');
    widthInput.setAttribute('value', width);
    widthInput.style.width = '180px';

    td = document.createElement('td');
    td.appendChild(widthInput);
    row2.appendChild(td);

    tbody.appendChild(row2);

    var row3 = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '10pt';
    mxUtils.write(td, mxResources.get('height') + ':');

    row3.appendChild(td);

    var heightInput = document.createElement('input');
    heightInput.setAttribute('value', height);
    heightInput.style.width = '180px';

    td = document.createElement('td');
    td.appendChild(heightInput);
    row3.appendChild(td);

    tbody.appendChild(row3);

    var row4 = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '10pt';
    mxUtils.write(td, mxResources.get('borderWidth') + ':');

    row4.appendChild(td);

    var borderInput = document.createElement('input');
    borderInput.setAttribute('value', width);
    borderInput.style.width = '180px';
    borderInput.value = '0';

    td = document.createElement('td');
    td.appendChild(borderInput);
    row4.appendChild(td);

    tbody.appendChild(row4);
    table.appendChild(tbody);

    // Handles changes in the export format
    function formatChanged()
    {
        var name = nameInput.value;
        var dot = name.lastIndexOf('.');

        if (dot > 0)
        {
            nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
        }
        else
        {
            nameInput.value = name + '.' + imageFormatSelect.value;
        }

        if (imageFormatSelect.value === 'xml' || imageFormatSelect.value === 'json' || imageFormatSelect.value == 'yaml' || imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg' || imageFormatSelect.value === 'jpg')
        {
            // widthInput.setAttribute('disabled', 'true');
            // heightInput.setAttribute('disabled', 'true');
            // borderInput.setAttribute('disabled', 'true');
            row1.setAttribute('hidden', 'true');
            row2.setAttribute('hidden', 'true');
            row3.setAttribute('hidden', 'true');
            row4.setAttribute('hidden', 'true');
        }
        else
        {
            // widthInput.removeAttribute('disabled');
            // heightInput.removeAttribute('disabled');
            // borderInput.removeAttribute('disabled');
            row1.removeAttribute('hidden');
            row2.removeAttribute('hidden');
            row3.removeAttribute('hidden');
            row4.removeAttribute('hidden');
        }

        // if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg')
        // {
        //     // backgroundCheckbox.removeAttribute('disabled');
			//
        // }
        // else
        // {
        //     // backgroundCheckbox.setAttribute('disabled', 'disabled');
        // }
    };

    mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
    formatChanged();

    function checkValues()
    {
        if (widthInput.value * heightInput.value > MAX_AREA || widthInput.value <= 0)
        {
            widthInput.style.backgroundColor = 'red';
        }
        else
        {
            widthInput.style.backgroundColor = '';
        }

        if (widthInput.value * heightInput.value > MAX_AREA || heightInput.value <= 0)
        {
            heightInput.style.backgroundColor = 'red';
        }
        else
        {
            heightInput.style.backgroundColor = '';
        }
    };

    mxEvent.addListener(widthInput, 'change', function()
    {
        if (width > 0)
        {
            heightInput.value = Math.ceil(parseInt(widthInput.value) * height / width);
        }
        else
        {
            heightInput.value = '0';
        }

        checkValues();
    });

    mxEvent.addListener(heightInput, 'change', function()
    {
        if (height > 0)
        {
            widthInput.value = Math.ceil(parseInt(heightInput.value) * width / height);
        }
        else
        {
            widthInput.value = '0';
        }

        checkValues();
    });

    // Resuable image export instance
    var imgExport = new mxImageExport();

    function getSvg()
    {
        var b = Math.max(0, parseInt(borderInput.value)) + 1;
        var scale = parseInt(widthInput.value) / width;
        var bg = null;

        if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE && !backgroundCheckbox.checked)
        {
            bg = backgroundInput.value;
        }

        return graph.getSvg(bg, scale, b);
    };

    function getXml()
    {
        return mxUtils.getXml(editorUi.editor.getGraphXml(editorUi));
    };
    function loadImage(url) {
        return new Promise(function(resolve, reject) {
            var image = new Image();
            image.src = url;
            image.crossOrigin = 'Anonymous';
            image.onload = function() {
                resolve(this);
            };
            image.onerror = function(err) {
                reject(err);
            };
        });
    };

    row = document.createElement('tr');
    td = document.createElement('td');
    td.setAttribute('align', 'right');
    td.style.paddingTop = '24px';
    td.colSpan = 2;

    var saveBtn = mxUtils.button(mxResources.get('export'), mxUtils.bind(this, function()
    {
        if (parseInt(widthInput.value) <= 0 && parseInt(heightInput.value) <= 0)
        {
            mxUtils.alert(mxResources.get('drawingEmpty'));
        }
        else
        {
            var format = imageFormatSelect.value;
            var name = nameInput.value;
            if (format == 'xml' || format == 'json' || format == 'yaml')
            {
                var outValue;
                editorUi.hideDialog();
                var graphXml = editorUi.editor.getGraphXml(editorUi);
                if(format == 'xml') {
                    outValue = mxUtils.getPrettyXml(graphXml);
                }
                else if(format == 'json') {
                    var xmlDoc = mxUtils.parseXml(mxUtils.getXml(graphXml));
                    outValue = CodeTranslator.xml2json(xmlDoc, '  ');
                }
                else if(format == 'yaml') {
                    var xmlDoc = mxUtils.parseXml(mxUtils.getXml(graphXml));
                    outValue = CodeTranslator.xml2json(xmlDoc, "  ");
                    outValue = jsyaml.dump(JSON.parse(outValue));
                }
                var blob = new Blob([outValue], {type: "text/plain;charset=utf-8"});
                fileSaveAs(blob, name);
            }
            else if (format == 'svg')
            {
                var svgXml = mxUtils.getXml(getSvg());

                if (svgXml.length < MAX_REQUEST_SIZE)
                {
                    editorUi.hideDialog();
                    var blob = new Blob([svgXml], {type: "text/plain;charset=utf-8"});
                    fileSaveAs(blob, name);
                    // ExportDialog.saveLocalFile(xml, name, format);
                }
                else
                {
                    mxUtils.alert(mxResources.get('drawingTooLarge'));
                    mxUtils.popup(xml);
                }
            }
            else if(format == 'png' || format == 'gif' || format == 'jpg')
            {
            	var svg = getSvg();
                var svgXml = mxUtils.getXml(svg);
                //在canvas中加载SVG需要先去掉image，否则重新绘制image（底色透明）时未遮盖部分会有默认图片出现
                svgXml = svgXml.replace(/\<image[^\\>]*\>/g, '');
				var svgUrl = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml)));
                var svgWidth = parseInt(svg.getAttribute('width'));
                var svgHeight = parseInt(svg.getAttribute('height'));
                var embededImages = svg.querySelectorAll('image');

				// 由 nodeList 转为 array
                embededImages = Array.prototype.slice.call(embededImages);

                //获取模型折叠图片
                graph.selectAll(null, false);
				var cells = graph.getSelectionCells();
                graph.clearSelection();
				var tmpArr = [];
				var leftTopPoint = {};
				for(var a in cells) {
					var style = cells[a].getStyle();
					var pId = cells[a].parent.id;
                    var geo = cells[a].geometry;
                    if(pId == '1' && cells[a].vertex == '1') {
                        //获取左上角坐标
                        if(!leftTopPoint.x || (leftTopPoint.x && geo.x < leftTopPoint.x)) {
                            leftTopPoint.x = geo.x;
                        }
                        if(!leftTopPoint.y || (leftTopPoint.y && geo.y < leftTopPoint.y)) {
                            leftTopPoint.y = geo.y;
                        }
					}

					if(style.indexOf('group') >= 0 && style.indexOf('collapsible=1') >= 0) {
                        var collapsed = cells[a].collapsed;
                        var colImageSrc;
                        var iX = geo.x;
                        var iY = geo.y;
                        var iW, iH;
                        if(collapsed) {
                            colImageSrc = cells[a].value.getAttribute('image');
                            iW = graph.view.getState(cells[a]).width;
                            iH = graph.view.getState(cells[a]).height;
						}
						else {
                            colImageSrc = mxGraph.prototype.expandedImage.src;
                            iX += 5;
                            iY += 5;
                            iW = mxGraph.prototype.expandedImage.width;
                            iH = mxGraph.prototype.expandedImage.height;
						}
						var ele = document.createElement('img');
                        ele.setAttribute('x', iX);
                        ele.setAttribute('y', iY);
                        ele.setAttribute('width', iW);
                        ele.setAttribute('height', iH);
                        ele.setAttribute('xlink:href', colImageSrc);
                        tmpArr.push(ele);
                        ele.remove();
					}
				}
				for(var t in tmpArr) {
                    tmpArr[t].setAttribute('x', parseInt(tmpArr[t].getAttribute('x')) - leftTopPoint.x);
                    tmpArr[t].setAttribute('y', parseInt(tmpArr[t].getAttribute('y')) - leftTopPoint.y);
                    embededImages.push(tmpArr[t]);
				}

                editorUi.hideDialog();
                // 加载底层的图
                loadImage(svgUrl).then(function(img) {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext("2d");
                    canvas.width = svgWidth;
                    canvas.height = svgHeight;
                    ctx.drawImage(img, 0, 0);

                    // 遍历 svg 里面所有的 image 元素
                    embededImages.reduce(function(sequence, svgImg){
                        return sequence.then(function() {
                            var url = svgImg.getAttribute('xlink:href'),
                                dX = parseInt(svgImg.getAttribute('x')),
                                dY = parseInt(svgImg.getAttribute('y')),
                                dW = parseInt(svgImg.getAttribute('width')),
                                dH = parseInt(svgImg.getAttribute('height'));
                            return loadImage(url).then(function(sImg) {
                            	var sx = 0, sy = 0, sw = sImg.width, sh = sImg.height;
                            	var dx,dy,dw,dh;
								sw/sh > dW/dH ? (dx = dX, dy = dY + (dH - sh*dW/sw)/2, dw = sw*dW/sw, dh = sh*dW/sw) :
                                    			(dx = dX + (dW - sw*dH/sh)/2, dy = dY, dw = sw*dH/sh, dh = sh*dH/sh);
                                ctx.drawImage(sImg, sx, sy, sw, sh, dx, dy, dw, dh);
                            }, function(err) {
                                console.log(err);
                            });
                        }, function(err) {
                            console.log(err);
                        });
                    }, Promise.resolve()).then(function() {
                        // 准备在前端下载
                        var a = document.createElement("a");
                        a.download = name;
                        format == 'jpg' ? format = 'jpeg' : format;
                        a.href = canvas.toDataURL("image/" + format, '1.0');
                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        a.dispatchEvent(clickEvent);
                    });
                }, function(err) {
                    console.log(err);
                })
            }
            else
            {
                var param = null;
                var w = parseInt(widthInput.value) || 0;
                var h = parseInt(heightInput.value) || 0;
                var b = Math.max(0, parseInt(borderInput.value)) + 1;

                var exp = ExportDialog.getExportParameter(editorUi, format);

                if (typeof exp == 'function')
                {
                    param = exp();
                }
                else
                {
                    var scale = parseInt(widthInput.value) / width;
                    var bounds = graph.getGraphBounds();
                    var vs = graph.view.scale;

                    // New image export
                    var xmlDoc = mxUtils.createXmlDocument();
                    var root = xmlDoc.createElement('output');
                    xmlDoc.appendChild(root);

                    // Renders graph. Offset will be multiplied with state's scale when painting state.
                    var xmlCanvas = new mxXmlCanvas2D(root);
                    xmlCanvas.translate(Math.floor((b / scale - bounds.x) / vs), Math.floor((b / scale - bounds.y) / vs));
                    xmlCanvas.scale(scale / vs);
                    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

                    // Puts request data together
                    w = Math.ceil(bounds.width * scale / vs + 2 * b);
                    h = Math.ceil(bounds.height * scale / vs + 2 * b);
                    param = 'xml=' + encodeURIComponent(mxUtils.getXml(root));
                }

                // Requests image if request is valid
                if (param != null && param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA)
                {
                    var bg = '&bg=none';

                    if (backgroundInput.value != '' && backgroundInput.value != mxConstants.NONE &&
                        (format != 'png' || !backgroundCheckbox.checked))
                    {
                        bg = '&bg=' + backgroundInput.value;
                    }

                    editorUi.hideDialog();
                    var data = decodeURIComponent(param.substring(param.indexOf('=') + 1));
                    ExportDialog.saveRequest(data, name, format,
                        function(newTitle, base64)
                        {
                            // Base64 not used in this example
                            return new mxXmlRequest(EXPORT_URL, 'format=' + format + '&base64=' + (base64 || '0') +
                                ((newTitle != null) ? '&filename=' + encodeURIComponent(newTitle) : '') +
                                bg + '&w=' + w + '&h=' + h + '&border=' + b + '&' + param);
                        });
                }
                else
                {
                    mxUtils.alert(mxResources.get('drawingTooLarge'));
                }
            }
        }
    }));
    saveBtn.className = 'geBtn gePrimaryBtn';

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
    {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst)
    {
        td.appendChild(cancelBtn);
        td.appendChild(saveBtn);
    }
    else
    {
        td.appendChild(saveBtn);
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);
    table.appendChild(tbody);
    this.container = table;
};

/**
 * Global switches for the export dialog.
 */
ExportDialog.showPngOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showGifOption = false;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showJpgOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showSvgOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showPdfOption = false;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showXmlOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showJsonOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showYamlOption = true;

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.saveLocalFile = function(data, filename, format)
{
	new mxXmlRequest(SAVE_URL, 'xml=' + encodeURIComponent(data) + '&filename=' +
		encodeURIComponent(filename) + '&format=' + format).simulate(document, '_blank');
};

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.saveRequest = function(data, filename, format, fn)
{
	fn(filename).simulate(document, '_blank');
};

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.getExportParameter = function(ui, format)
{
	return null;
};

/**
 * Constructs a new metadata dialog.
 */
var EditDataDialog = function(ui, cell)
{
	var div = document.createElement('div');
	var graph = ui.editor.graph;

	div.style.height = '310px';
	div.style.overflow = 'auto';
	
	var value = graph.getModel().getValue(cell);
	
	// Converts the value to an XML node
	if (!mxUtils.isNode(value))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}

	// Creates the dialog contents
	var form = new mxForm('properties');
	form.table.style.width = '95%';
	form.table.style.paddingRight = '20px';

	var attrs = value.attributes;
	var names = [];
	var texts = [];
	var count = 0;
	
	var addRemoveButton = function(text, name)
	{
		text.parentNode.style.marginRight = '12px';
		
		var removeAttr = document.createElement('a');
		var img = mxUtils.createImage(Dialog.prototype.closeImage);
		img.style.height = '9px';
		img.style.fontSize = '9px';
		img.style.marginBottom = '7px';
		
		removeAttr.className = 'geButton';
		removeAttr.setAttribute('title', mxResources.get('delete'));
		removeAttr.style.margin = '0px';
		removeAttr.style.width = '14px';
		removeAttr.style.height = '14px';
		removeAttr.style.fontSize = '14px';
		removeAttr.style.cursor = 'pointer';
		removeAttr.style.marginLeft = '6px';
		removeAttr.appendChild(img);
		
		var removeAttrFn = (function(name)
		{
			return function()
			{
				var count = 0;
				
				for (var j = 0; j < names.length; j++)
				{
					if (names[j] == name)
					{
						texts[j] = null;
						form.table.deleteRow(count);
						
						break;
					}
					
					if (texts[j] != null)
					{
						count++;
					}
				}
			};
		})(name);
		
		mxEvent.addListener(removeAttr, 'click', removeAttrFn);
		
		text.parentNode.style.whiteSpace = 'nowrap';
		text.parentNode.appendChild(removeAttr);
	};
	
	var addText = function(index, name, values)
	{
		names[index] = name;
		texts[index] = form.addText2(names[count] + ':', values);
		for( var i in texts[index]) {
            texts[index][i].style.width = '95%';
		}
		texts[index][0].setAttribute('placeholder', mxResources.get('enterPropertyCName'));
        texts[index][1].setAttribute('placeholder', mxResources.get('enterPropertyValue'));

		addRemoveButton(texts[index][i], name);
	};

	for (var i = 0; i < attrs.length; i++)
	{
		if (attrs[i].nodeName != 'label' && attrs[i].nodeName != 'placeholders')
		{
			var nValue = attrs[i].nodeValue;
			var ei = nValue.indexOf(":");
            var aValue = [];
            aValue[0] = nValue.substr(0, ei);
			aValue[1] = nValue.substr(ei + 1);
            addText(count, attrs[i].nodeName, aValue);
			count++;
		}
	}
	
	div.appendChild(form.table);

	var newProp = document.createElement('div');
	newProp.style.whiteSpace = 'nowrap';
	newProp.style.marginTop = '6px';

	var nameInput = document.createElement('input');
	nameInput.setAttribute('placeholder', mxResources.get('enterPropertyName'));
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('size', (mxClient.IS_QUIRKS) ? '18' : '22');
	nameInput.style.marginLeft = '2px';

	newProp.appendChild(nameInput);
	div.appendChild(newProp);
	
	var addBtn = mxUtils.button(mxResources.get('addProperty'), function()
	{
		if (nameInput.value.length > 0)
		{
			var name = nameInput.value;
			
			if (name != null && name.length > 0 && name != 'label' && name != 'placeholders')
			{
				try
				{
					var idx = mxUtils.indexOf(names, name);
					
					if (idx >= 0 && texts[idx] != null)
					{
						texts[idx][0].focus();
					}
					else
					{
						// Checks if the name is valid
						var clone = value.cloneNode(false);
						clone.setAttribute(name, '');
						
						if (idx >= 0)
						{
							names.splice(idx, 1);
							texts.splice(idx, 1);
						}

						names.push(name);
						var arrValue = ['',''];
						var text = form.addText2(name + ':', arrValue);
						for(var i in text) {
                            text[i].style.width = '95%';
                        }
                        text[0].setAttribute('placeholder', mxResources.get('enterPropertyCName'));
                        text[1].setAttribute('placeholder', mxResources.get('enterPropertyValue'));
						texts.push(text);
						addRemoveButton(text[i], name);

						text[0].focus();
					}

					nameInput.value = '';
				}
				catch (e)
				{
					mxUtils.alert(e);
				}
			}
		}
		else
		{
			mxUtils.alert(mxResources.get('invalidName'));
		}
	});
	
	this.init = function()
	{
		if (texts.length > 0)
		{
			texts[0][0].focus();
		}
		else
		{
			nameInput.focus();
		}
	};
	
	addBtn.setAttribute('disabled', 'disabled');
	addBtn.style.marginLeft = '10px';
	addBtn.style.width = '144px';
	newProp.appendChild(addBtn);

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		ui.hideDialog.apply(ui, arguments);
	});
	cancelBtn.className = 'geBtn';
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		try
		{
			ui.hideDialog.apply(ui, arguments);
			
			// Clones and updates the value
			value = value.cloneNode(true);
			
			for (var i = 0; i < names.length; i++)
			{
				if (texts[i] == null)
				{
					value.removeAttribute(names[i]);
				}
				else
				{
					var arrText = [];
					for(var j in texts[i]) {
                        arrText.push(texts[i][j].value);
					}
					value.setAttribute(names[i], arrText.join(":"));
				}
			}
			
			// Updates the value of the cell (undoable)
			graph.getModel().setValue(cell, value);
		}
		catch (e)
		{
			mxUtils.alert(e);
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	
	function updateAddBtn()
	{
		if (nameInput.value.length > 0)
		{
			addBtn.removeAttribute('disabled');
		}
		else
		{
			addBtn.setAttribute('disabled', 'disabled');
		}
	};

	mxEvent.addListener(nameInput, 'keyup', updateAddBtn);
	
	// Catches all changes that don't fire a keyup (such as paste via mouse)
	mxEvent.addListener(nameInput, 'change', updateAddBtn);
	
	var buttons = document.createElement('div');
	buttons.style.marginTop = '18px';
	buttons.style.textAlign = 'right';
	
	if (ui.editor.graph.getModel().isVertex(cell) || ui.editor.graph.getModel().isEdge(cell))
	{
		var replace = document.createElement('span');
		replace.style.marginRight = '10px';
		var input = document.createElement('input');
		input.setAttribute('type', 'checkbox');
		input.style.marginRight = '6px';
		
		if (value.getAttribute('placeholders') == '1')
		{
			input.setAttribute('checked', 'checked');
			input.defaultChecked = true;
		}
	
		mxEvent.addListener(input, 'click', function()
		{
			if (value.getAttribute('placeholders') == '1')
			{
				value.removeAttribute('placeholders');
			}
			else
			{
				value.setAttribute('placeholders', '1');
			}
		});
		
		replace.appendChild(input);
		mxUtils.write(replace, mxResources.get('placeholders'));
		
		if (EditDataDialog.placeholderHelpLink != null)
		{
			var link = document.createElement('a');
			link.setAttribute('href', EditDataDialog.placeholderHelpLink);
			link.setAttribute('title', mxResources.get('help'));
			link.setAttribute('target', '_blank');
			link.style.marginLeft = '10px';
			link.style.cursor = 'help';
			
			var icon = document.createElement('img');
			icon.setAttribute('border', '0');
			icon.setAttribute('valign', 'middle');
			icon.style.marginTop = '-4px';
			icon.setAttribute('src', Editor.helpImage);
			link.appendChild(icon);
			
			replace.appendChild(link);
		}
		
		buttons.appendChild(replace);
	}
	
	if (ui.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(applyBtn);
	}
	else
	{
		buttons.appendChild(applyBtn);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;
};

/**
 * Optional help link.
 */
EditDataDialog.placeholderHelpLink = null;

/**
 * Constructs a new link dialog.
 */
var LinkDialog = function(editorUi, initialValue, btnLabel, fn)
{
	var div = document.createElement('div');
	mxUtils.write(div, mxResources.get('editLink') + ':');
	
	var inner = document.createElement('div');
	inner.className = 'geTitle';
	inner.style.backgroundColor = 'transparent';
	inner.style.borderColor = 'transparent';
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.cursor = 'default';
	
	if (!mxClient.IS_VML)
	{
		inner.style.paddingRight = '20px';
	}
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', initialValue);
	linkInput.setAttribute('placeholder', 'http://www.example.com/');
	linkInput.setAttribute('type', 'text');
	linkInput.style.marginTop = '6px';
	linkInput.style.width = '400px';
	linkInput.style.backgroundImage = 'url(\'' + Dialog.prototype.clearImage + '\')';
	linkInput.style.backgroundRepeat = 'no-repeat';
	linkInput.style.backgroundPosition = '100% 50%';
	linkInput.style.paddingRight = '14px';
	
	var cross = document.createElement('div');
	cross.setAttribute('title', mxResources.get('reset'));
	cross.style.position = 'relative';
	cross.style.left = '-16px';
	cross.style.width = '12px';
	cross.style.height = '14px';
	cross.style.cursor = 'pointer';

	// Workaround for inline-block not supported in IE
	cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
	cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';
	
	// Needed to block event transparency in IE
	cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';

	mxEvent.addListener(cross, 'click', function()
	{
		linkInput.value = '';
		linkInput.focus();
	});
	
	inner.appendChild(linkInput);
	inner.appendChild(cross);
	div.appendChild(inner);
	
	this.init = function()
	{
		linkInput.focus();
		
		if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			linkInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};
	
	var btns = document.createElement('div');
	btns.style.marginTop = '18px';
	btns.style.textAlign = 'right';

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			editorUi.hideDialog();
			fn(linkInput.value);
		}
	});

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	var mainBtn = mxUtils.button(btnLabel, function()
	{
		editorUi.hideDialog();
		fn(linkInput.value);
	});
	mainBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(mainBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * Constructs a local image dialog.
 */
var LocalImgDialog = function(editorUi, btnLabel, fn)
{
	var div = document.createElement('div');
	mxUtils.write(div, mxResources.get('insertLocal') + ':');
	
	var inner = document.createElement('div');
	inner.className = 'geTitle';
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.marginTop = '10px';
	inner.style.position = 'relative';
	
	if (!mxClient.IS_VML)
	{
		inner.style.paddingRight = '20px';
	}
	var imgA = document.createElement('a');
	imgA.className = 'fileA btn-purple';
	mxUtils.write(imgA, mxResources.get('selectImgFile'));

	var span = document.createElement('span');
	span.style.position = 'absolute';
	span.style.top = '6px';
	span.style.marginLeft = '10px';
	span.style.width = '230px';
	span.style.textOverflow = 'ellipsis';
	span.style.overflow = 'hidden';
	
	var imgInput = document.createElement('input');
	imgInput.className = 'fileInput';
	imgInput.setAttribute('type', 'file');
	imgInput.setAttribute('accept', 'image/png,image/jpeg');
	mxEvent.addListener(imgInput, 'change', function () {
		if (imgInput.files.length > 0) {
			mxUtils.write(span, imgInput.files[0].name);
			span.setAttribute('title', imgInput.files[0].name);
		}
	});
	
	imgA.appendChild(imgInput);
	inner.appendChild(imgA);
	inner.appendChild(span);
	div.appendChild(inner);
	
	var btns = document.createElement('div');
	btns.style.marginTop = '18px';
	btns.style.textAlign = 'right';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	var mainBtn = mxUtils.button(btnLabel, function()
	{
		editorUi.hideDialog();
		if(imgInput.files.length > 0){
			//Check file size
            var fileSize = imgInput.files[0].size;
            if(fileSize > editorUi.maxUploadImgSize * 1024 * 1024){
                mxUtils.alert(mxResources.get('maxFileSize', [editorUi.maxUploadImgSize]));
                return;
            }
			var reader = new FileReader();
			reader.onload = function(e) {
                var img = new Image();
				img.src = e.target.result;
				var url = BASE_URL + SAVE_IMG;
				var params = 'data=' + encodeURIComponent(img.src);
				mxUtils.post(url, params, mxUtils.bind(this, function (req) {
					var result = JSON.parse(req.getText());
					if (result.status == 0) {
						var path = UPLOADIMAGE_PATH + '/' + result.data.url;
						fn(path, img.width, img.height);
					}
					else {
						mxUtils.alert(result.data.msg);
					}
				}));
			};
			reader.readAsDataURL(imgInput.files[0]);
		}
	});
	mainBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(mainBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * 
 */
var OutlineWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;

	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width = '100%';
	div.style.height = '100%';
	div.style.border = '1px solid whiteSmoke';
	div.style.overflow = 'hidden';

	this.editorUi = editorUi;
	this.window = new mxWindow(mxResources.get('outline'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	this.window.setLocation = function(x, y)
	{
		x = Math.max(0, x);
		y = Math.max(0, y);
		mxWindow.prototype.setLocation.apply(this, arguments);
	};
	
	mxEvent.addListener(window, 'resize', mxUtils.bind(this, function()
	{
		var iw = window.innerWidth || document.documentElement.clientWidth || this.editorUi.container.clientWidth;
		var ih = window.innerHeight || document.documentElement.clientHeight || this.editorUi.container.clientHeight;
		
		var x = this.window.getX();
		var y = this.window.getY();
		
		if (x + this.window.table.clientWidth > iw)
		{
			x = Math.max(0, iw - this.window.table.clientWidth);
		}
		
		if (y + this.window.table.clientHeight > ih)
		{
			y = Math.max(0, ih - this.window.table.clientHeight);
		}
		
		if (this.window.getX() != x || this.window.getY() != y)
		{
			this.window.setLocation(x, y);
		}
	}));
	
	var outline = editorUi.createOutline(this.window);

	this.window.addListener(mxEvent.RESIZE, mxUtils.bind(this, function()
   	{
		outline.update(false);
		outline.outline.sizeDidChange();
   	}));
	
	this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
	{
		outline.suspended = false;
		outline.outline.refresh();
		outline.update();
	}));
	
	this.window.addListener(mxEvent.HIDE, mxUtils.bind(this, function()
	{
		outline.suspended = true;
	}));
	
	this.window.addListener(mxEvent.NORMALIZE, mxUtils.bind(this, function()
	{
		outline.suspended = false;
		outline.update();
	}));
			
	this.window.addListener(mxEvent.MINIMIZE, mxUtils.bind(this, function()
	{
		outline.suspended = true;
	}));

	var outlineCreateGraph = outline.createGraph;
	outline.createGraph = function(container)
	{
		var g = outlineCreateGraph.apply(this, arguments);
		g.gridEnabled = false;
		g.pageScale = graph.pageScale;
		g.pageFormat = graph.pageFormat;
		g.background = graph.background;
		g.pageVisible = graph.pageVisible;
		
		var current = mxUtils.getCurrentStyle(graph.container);
		div.style.backgroundColor = current.backgroundColor;
		
		return g;
	};
	
	function update()
	{
		outline.outline.pageScale = graph.pageScale;
		outline.outline.pageFormat = graph.pageFormat;
		outline.outline.pageVisible = graph.pageVisible;
		outline.outline.background = graph.background;
		
		var current = mxUtils.getCurrentStyle(graph.container);
		div.style.backgroundColor = current.backgroundColor;
		
		if (graph.view.backgroundPageShape != null && outline.outline.view.backgroundPageShape != null)
		{
			outline.outline.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
		}
		
		outline.outline.refresh();
	};

	outline.init(div);

	editorUi.editor.addListener('resetGraphView', update);
	editorUi.addListener('pageFormatChanged', update);
	editorUi.addListener('backgroundColorChanged', update);
	editorUi.addListener('backgroundImageChanged', update);
	editorUi.addListener('pageViewChanged', function()
	{
		update();
		outline.update(true);
	});
	
	if (outline.outline.dialect == mxConstants.DIALECT_SVG)
	{
		var zoomInAction = editorUi.actions.get('zoomIn');
		var zoomOutAction = editorUi.actions.get('zoomOut');
		
		mxEvent.addMouseWheelListener(function(evt, up)
		{
			var outlineWheel = false;
			var source = mxEvent.getSource(evt);
	
			while (source != null)
			{
				if (source == outline.outline.view.canvas.ownerSVGElement)
				{
					outlineWheel = true;
					break;
				}
	
				source = source.parentNode;
			}
	
			if (outlineWheel)
			{
				if (up)
				{
					zoomInAction.funct();
				}
				else
				{
					zoomOutAction.funct();
				}
	
				mxEvent.consume(evt);
			}
		});
	}
};

/**
 * 
 */
var LayersWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;
	
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.background = 'whiteSmoke';
	div.style.border = '1px solid whiteSmoke';
	div.style.height = '100%';
	div.style.marginBottom = '10px';
	div.style.overflow = 'auto';

	var tbarHeight = (!EditorUi.compactUi) ? '30px' : '26px';
	
	var listDiv = document.createElement('div')
	listDiv.style.backgroundColor = '#e5e5e5';
	listDiv.style.position = 'absolute';
	listDiv.style.overflow = 'auto';
	listDiv.style.left = '0px';
	listDiv.style.right = '0px';
	listDiv.style.top = '0px';
	listDiv.style.bottom = tbarHeight;
	div.appendChild(listDiv);
	
	var dragSource = null;
	var dropIndex = null;
	
	mxEvent.addListener(div, 'dragover', function(evt)
	{
		evt.dataTransfer.dropEffect = 'move';
		dropIndex = null;
		evt.stopPropagation();
		evt.preventDefault();
	});

	var layerCount = null;
	var selectionLayer = null;
	
	var ldiv = document.createElement('div');
	
	ldiv.className = 'geToolbarContainer';
	ldiv.style.position = 'absolute';
	ldiv.style.bottom = '0px';
	ldiv.style.left = '0px';
	ldiv.style.right = '0px';
	ldiv.style.height = tbarHeight;
	ldiv.style.overflow = 'hidden';
	ldiv.style.padding = (!EditorUi.compactUi) ? '1px' : '4px 0px 3px 0px';
	ldiv.style.backgroundColor = 'whiteSmoke';
	ldiv.style.borderWidth = '1px 0px 0px 0px';
	ldiv.style.borderColor = '#c3c3c3';
	ldiv.style.borderStyle = 'solid';
	ldiv.style.display = 'block';
	ldiv.style.whiteSpace = 'nowrap';
	
	if (mxClient.IS_QUIRKS)
	{
		ldiv.style.filter = 'none';
	}
	
	var link = document.createElement('a');
	link.className = 'geButton';
	
	if (mxClient.IS_QUIRKS)
	{
		link.style.filter = 'none';
	}
	
	var removeLink = link.cloneNode();
	removeLink.innerHTML = '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>';

	mxEvent.addListener(removeLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			graph.model.beginUpdate();
			try
			{
				var index = graph.model.root.getIndex(selectionLayer);
				graph.removeCells([selectionLayer], false);
				
				// Creates default layer if no layer exists
				if (graph.model.getChildCount(graph.model.root) == 0)
				{
					graph.model.add(graph.model.root, new mxCell());
					graph.setDefaultParent(null);
				}
				else if (index > 0 && index <= graph.model.getChildCount(graph.model.root))
				{
					graph.setDefaultParent(graph.model.getChildAt(graph.model.root, index - 1));
				}
				else
				{
					graph.setDefaultParent(null);
				}
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		removeLink.className = 'geButton mxDisabled';
	}
	
	ldiv.appendChild(removeLink);

	var insertLink = link.cloneNode();
	insertLink.innerHTML = '<div class="geSprite geSprite-insert" style="display:inline-block;"></div>';
	
	mxEvent.addListener(insertLink, 'click', function(evt)
	{
		if (graph.isEnabled() && !graph.isSelectionEmpty())
		{
			graph.moveCells(graph.getSelectionCells(), 0, 0, false, selectionLayer);
		}
	});

	ldiv.appendChild(insertLink);
	
	var renameLink = link.cloneNode();
	renameLink.innerHTML = '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>';
	renameLink.setAttribute('title', mxResources.get('rename'));
	
	function renameLayer(layer)
	{
		if (graph.isEnabled() && layer != null)
		{
			var dlg = new FilenameDialog(editorUi, layer.value || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function(newValue)
			{
				if (newValue != null)
				{
					graph.getModel().setValue(layer, newValue);
				}
			}), mxResources.get('enterName'));
			editorUi.showDialog(dlg.container, 300, 100, true, true);
			dlg.init();
		}
	};
	
	mxEvent.addListener(renameLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			renameLayer(selectionLayer);
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		renameLink.className = 'geButton mxDisabled';
	}
	
	ldiv.appendChild(renameLink);
	
	var duplicateLink = link.cloneNode();
	duplicateLink.innerHTML = '<div class="geSprite geSprite-duplicate" style="display:inline-block;"></div>';
	
	mxEvent.addListener(duplicateLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			var newCell = null;
			graph.model.beginUpdate();
			try
			{
				newCell = graph.cloneCells([selectionLayer])[0];
				newCell.value = mxResources.get('untitledLayer');
				newCell.setVisible(true);
				newCell = graph.addCell(newCell, graph.model.root);
				graph.setDefaultParent(newCell);
			}
			finally
			{
				graph.model.endUpdate();
			}

			if (newCell != null && !graph.isCellLocked(newCell))
			{
				graph.selectAll(newCell);
			}
		}
	});
	
	if (!graph.isEnabled())
	{
		duplicateLink.className = 'geButton mxDisabled';
	}

	ldiv.appendChild(duplicateLink);

	var addLink = link.cloneNode();
	addLink.innerHTML = '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>';
	addLink.setAttribute('title', mxResources.get('addLayer'));
	
	mxEvent.addListener(addLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			graph.model.beginUpdate();
			
			try
			{
				var cell = graph.addCell(new mxCell(mxResources.get('untitledLayer')), graph.model.root);
				graph.setDefaultParent(cell);
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		addLink.className = 'geButton mxDisabled';
	}
	
	ldiv.appendChild(addLink);

	div.appendChild(ldiv);	
	
	function refresh()
	{
		layerCount = graph.model.getChildCount(graph.model.root)
		listDiv.innerHTML = '';

		function addLayer(index, label, child, defaultParent)
		{
			var ldiv = document.createElement('div');
			ldiv.className = 'geToolbarContainer';

			ldiv.style.overflow = 'hidden';
			ldiv.style.position = 'relative';
			ldiv.style.padding = '4px';
			ldiv.style.height = '22px';
			ldiv.style.display = 'block';
			ldiv.style.backgroundColor = 'whiteSmoke';
			ldiv.style.borderWidth = '0px 0px 1px 0px';
			ldiv.style.borderColor = '#c3c3c3';
			ldiv.style.borderStyle = 'solid';
			ldiv.style.whiteSpace = 'nowrap';
			
			var left = document.createElement('div');
			left.style.display = 'inline-block';
			left.style.width = '100%';
			left.style.textOverflow = 'ellipsis';
			left.style.overflow = 'hidden';
			
			mxEvent.addListener(ldiv, 'dragover', function(evt)
			{
				evt.dataTransfer.dropEffect = 'move';
				dropIndex = index;
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(ldiv, 'dragstart', function(evt)
			{
				dragSource = ldiv;
				
				// Workaround for no DnD on DIV in FF
				if (mxClient.IS_FF)
				{
					// LATER: Check what triggers a parse as XML on this in FF after drop
					evt.dataTransfer.setData('Text', '<layer/>');
				}
			});
			
			mxEvent.addListener(ldiv, 'dragend', function(evt)
			{
				if (dragSource != null)
				{
					graph.addCell(child, graph.model.root, dropIndex);
					dragSource = null;
					dropIndex = null;
				}
				
				evt.stopPropagation();
				evt.preventDefault();
			});

			var btn = document.createElement('img');
			btn.setAttribute('draggable', 'false');
			btn.setAttribute('align', 'top');
			btn.setAttribute('border', '0');
			btn.style.cursor = 'pointer';
			btn.style.padding = '4px';
			btn.setAttribute('title', mxResources.get('lockUnlock'));

			var state = graph.view.getState(child);
    		var style = (state != null) ? state.style : graph.getCellStyle(child);

			if (mxUtils.getValue(style, 'locked', '0') == '1')
			{
				btn.setAttribute('src', Dialog.prototype.lockedImage);
			}
			else
			{
				btn.setAttribute('src', Dialog.prototype.unlockedImage);
			}
			
			mxEvent.addListener(btn, 'click', function(evt)
			{
				if (graph.isEnabled())
				{
					var value = null;
					graph.getModel().beginUpdate();
					try
					{
			    		value = (mxUtils.getValue(style, 'locked', '0') == '1') ? null : '1';
			    		graph.setCellStyles('locked', value, [child]);
					}
					finally
					{
						graph.getModel().endUpdate();
					}

					if (value == '1')
					{
						graph.removeSelectionCells(graph.getModel().getDescendants(child));
					}
					
					mxEvent.consume(evt);
				}
			});

			left.appendChild(btn);

			var inp = document.createElement('input');
			inp.setAttribute('type', 'checkbox');
			inp.setAttribute('title', mxResources.get('hideIt', [child.value || mxResources.get('background')]));
			inp.style.marginLeft = '4px';
			inp.style.marginRight = '6px';
			inp.style.marginTop = '4px';
			left.appendChild(inp);
			
			if (!graph.isEnabled())
			{
				inp.setAttribute('disabled', 'disabled');
			}

			if (graph.model.isVisible(child))
			{
				inp.setAttribute('checked', 'checked');
				inp.defaultChecked = true;
			}

			mxEvent.addListener(inp, 'click', function(evt)
			{
				if (graph.isEnabled())
				{
					graph.model.setVisible(child, !graph.model.isVisible(child));
					mxEvent.consume(evt);
				}
			});

			mxUtils.write(left, label);
			ldiv.appendChild(left);
			
			if (graph.isEnabled())
			{
				// Fallback if no drag and drop is available
				if (mxClient.IS_TOUCH || mxClient.IS_POINTER || mxClient.IS_VML ||
					(mxClient.IS_IE && document.documentMode < 10))
				{
					var right = document.createElement('div');
					right.style.display = 'block';
					right.style.textAlign = 'right';
					right.style.whiteSpace = 'nowrap';
					right.style.position = 'absolute';
					right.style.right = '6px';
					right.style.top = '6px';
		
					// Poor man's change layer order
					if (index > 0)
					{
						var img2 = document.createElement('a');
						
						img2.setAttribute('title', mxResources.get('toBack'));
						
						img2.className = 'geButton';
						img2.style.cssFloat = 'none';
						img2.innerHTML = '&#9650;';
						img2.style.width = '14px';
						img2.style.height = '14px';
						img2.style.fontSize = '14px';
						img2.style.margin = '0px';
						img2.style.marginTop = '-1px';
						right.appendChild(img2);
						
						mxEvent.addListener(img2, 'click', function(evt)
						{
							if (graph.isEnabled())
							{
								graph.addCell(child, graph.model.root, index - 1);
							}
							
							mxEvent.consume(evt);
						});
					}
		
					if (index >= 0 && index < layerCount - 1)
					{
						var img1 = document.createElement('a');
						
						img1.setAttribute('title', mxResources.get('toFront'));
						
						img1.className = 'geButton';
						img1.style.cssFloat = 'none';
						img1.innerHTML = '&#9660;';
						img1.style.width = '14px';
						img1.style.height = '14px';
						img1.style.fontSize = '14px';
						img1.style.margin = '0px';
						img1.style.marginTop = '-1px';
						right.appendChild(img1);
						
						mxEvent.addListener(img1, 'click', function(evt)
						{
							if (graph.isEnabled())
							{
								graph.addCell(child, graph.model.root, index + 1);
							}
							
							mxEvent.consume(evt);
						});
					}
					
					ldiv.appendChild(right);
				}
				
				if (mxClient.IS_SVG && (!mxClient.IS_IE || document.documentMode >= 10))
				{
					ldiv.setAttribute('draggable', 'true');
					ldiv.style.cursor = 'move';
				}
			}

			mxEvent.addListener(ldiv, 'dblclick', function(evt)
			{
				var nodeName = mxEvent.getSource(evt).nodeName;
				
				if (nodeName != 'INPUT' && nodeName != 'IMG')
				{
					renameLayer(child);
					mxEvent.consume(evt);
				}
			});

			if (graph.getDefaultParent() == child)
			{
				ldiv.style.background = '#e6eff8';
				selectionLayer = child;
			}
			else
			{
				mxEvent.addListener(ldiv, 'click', function(evt)
				{
					if (graph.isEnabled())
					{
						graph.setDefaultParent(defaultParent);
						graph.view.setCurrentRoot(null);
						refresh();
					}
				});
			}
			
			listDiv.appendChild(ldiv);
		};
		
		// Cannot be moved or deleted
		for (var i = 0; i < layerCount; i++)
		{
			(mxUtils.bind(this, function(child)
			{
				addLayer(i, child.value || mxResources.get('background'), child, child);
			}))(graph.model.getChildAt(graph.model.root, i));
		}
		
		removeLink.setAttribute('title', mxResources.get('removeIt', [selectionLayer.value || mxResources.get('background')]));
		insertLink.setAttribute('title', mxResources.get('moveSelectionTo', [selectionLayer.value || mxResources.get('background')]));
		duplicateLink.setAttribute('title', mxResources.get('duplicateIt', [selectionLayer.value || mxResources.get('background')]));
		renameLink.setAttribute('title', mxResources.get('renameIt', [selectionLayer.value || mxResources.get('background')]));
		
		if (graph.isSelectionEmpty())
		{
			insertLink.className = 'geButton mxDisabled';
		}
	};

	refresh();
	graph.model.addListener(mxEvent.CHANGE, function()
	{
		refresh();
	});

	graph.selectionModel.addListener(mxEvent.CHANGE, function()
	{
		if (graph.isSelectionEmpty())
		{
			insertLink.className = 'geButton mxDisabled';
		}
		else
		{
			insertLink.className = 'geButton';
		}
	});

	this.editorUi = editorUi;
	this.window = new mxWindow(mxResources.get('layers'), div, x, y, w, h, true, true);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	// Make refresh available via instance
	this.refreshLayers = refresh;
	
	this.window.setLocation = function(x, y)
	{
		x = Math.max(0, x);
		y = Math.max(0, y);
		mxWindow.prototype.setLocation.apply(this, arguments);
	};
	
	mxEvent.addListener(window, 'resize', mxUtils.bind(this, function()
	{
		var iw = window.innerWidth || document.documentElement.clientWidth || this.editorUi.container.clientWidth;
		var ih = window.innerHeight || document.documentElement.clientHeight || this.editorUi.container.clientHeight;
		
		var x = this.window.getX();
		var y = this.window.getY();
		
		if (x + this.window.table.clientWidth > iw)
		{
			x = Math.max(0, iw - this.window.table.clientWidth);
		}
		
		if (y + this.window.table.clientHeight > ih)
		{
			y = Math.max(0, ih - this.window.table.clientHeight);
		}
		
		if (this.window.getX() != x || this.window.getY() != y)
		{
			this.window.setLocation(x, y);
		}
	}));
};
