export const downloadFile = (
  fileName: string,
  _data: {data: string; type: string} | Blob
) => {
  let data = _data;
  if (!(data instanceof Blob)) {
    data = new Blob([data.data], {type: data.type});
  }

  const el = document.createElement('a');
  el.href = URL.createObjectURL(data);
  el.download = fileName;
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};
