if (!console.count) {
  const counts = {};

  console.count = ((label = '<no label>') => {
    if (!counts[label]) counts[label] = 0;
    counts[label] += 1;
    console.log(`${label}: ${counts[label]}`);
  });
}
