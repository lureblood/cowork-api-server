const express = require('express');

const app = express();

const db = require('./models');

const { Member } = db;

app.use(express.json()); //middleware: request 의 body 에 json 이 있으면 이걸 body property 에 할당.

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({ where: { team }});
    res.send(teamMembers);
  } else{
    const members = await Member.findAll();
    res.send(members);
  }
  //res.send(members);
});



app.get('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({where: {id}});
  if(member) {
    res.send(member);
  } else{
    res.status(404).send({message: 'There is no member with the id!'});
  }
});

app.post('/api/members', async (req, res)=> {
  const newMember = req.body;
  const member = Member.build(newMember);
  await member.save();
  res.send(newMember);
});

/* app.put('/api/members/:id',async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const result = await Member.update(newInfo, {where: { id } });
  //const member = members.find((m) => m.id === Number(id));
  if (result[0] /*member) {
    res.send({ message: `${result[0]} row(s) affected`});
    //Object.keys(newInfo).forEach((prop) => {
    //  member[prop] = newInfo[prop];
    //});
    //res.send(member);
  } else {
    res.status(404).send({message: 'There is no member with the id!'});
  }
}); */

app.put('/api/members/:id',async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({where: { id } });
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];    
    });
    await member.save();
    res.send(member);
  } else {
    res.status(404).send({message: 'There is no member with the id!'});
  }  
});


/* app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const membersCount = members.length;
  members = members.filter((member) => member.id !==Number(id));
  if(members.length < membersCount) {
    res.send({message: 'Deleted'});    
  } else {
    res.status(404).send({message: 'There is no member with the id!'});    
  }
}); */

app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Member.destroy({where: {id} });
  if (deletedCount) {
    res.send({message: `${deletedCount} row(s) deleted`});
  } else {
    res.status(404).send({message: 'There is no member with the id!'});    
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening...');
});